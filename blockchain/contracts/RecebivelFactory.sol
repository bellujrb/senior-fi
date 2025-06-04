// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IRecebivelOracle {
    function getBNBPrice() external view returns (uint256);
    function getILPIRating(address ilpi) external view returns (uint8);
    function isRecebivelPaid(uint256 tokenId) external view returns (bool);
    function getMarketInterestRate() external view returns (uint256);
    function getInflationRate() external view returns (uint256);
}

contract RecebivelToken is ERC20, Ownable {
    string public ilpiName;
    uint256 public dueDate;
    uint256 public discountValue;
    uint256 public totalDebtValue;
    address public factory;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _ilpiName,
        uint256 _discountValue,
        uint256 _totalDebtValue,
        uint256 _dueDate,
        address _owner
    ) ERC20(_name, _symbol) Ownable(msg.sender) { 
        ilpiName = _ilpiName;
        discountValue = _discountValue;
        totalDebtValue = _totalDebtValue;
        dueDate = _dueDate;
        factory = msg.sender;
        _mint(factory, 1 ether);
        
        if (_owner != msg.sender) {
            transferOwnership(_owner);
        }
    }
}

contract RecebivelFactory is Ownable {

    IRecebivelOracle public oracle;

    uint256 public baseRiskRate = 200; // 2%
    
    receive() external payable {}

    function deposit() external payable onlyOwner {}

    mapping(address => bool) public authorizedILPIs;
    
    struct TokenInfo {
        address tokenAddress;
        address ilpi;
        bool redeemed;
        uint256 investmentAmount;
        uint256 creationTimestamp;
        uint8 ilpiRatingAtCreation;
    }

    mapping(uint256 => TokenInfo) public tokens;
    uint256 public tokenIdCounter;

    event TokenCreated(uint256 indexed id, address token, address ilpi, uint8 ilpiRating);
    event TokenPurchased(uint256 indexed id, address investor, uint256 value, uint256 bnbPrice);
    event TokenRedeemed(uint256 indexed id, address investor, uint256 payout);
    event TokenRedeemedEarly(uint256 indexed id, address investor, uint256 payout, string reason);
    event ILPIAuthorized(address indexed ilpi);
    event ILPIRevoked(address indexed ilpi);
    event OracleUpdated(address indexed newOracle);

    constructor(address _oracle) Ownable(msg.sender) {
        oracle = IRecebivelOracle(_oracle);
    }


    function setOracle(address _oracle) external onlyOwner {
        oracle = IRecebivelOracle(_oracle);
        emit OracleUpdated(_oracle);
    }

    function setBaseRiskRate(uint256 _rate) external onlyOwner {
        require(_rate <= 1000, "Risk rate too high"); // Max 10%
        baseRiskRate = _rate;
    }

    function authorizeILPI(address ilpi) external onlyOwner {
        authorizedILPIs[ilpi] = true;
        emit ILPIAuthorized(ilpi);
    }

    function revokeILPI(address ilpi) external onlyOwner {
        authorizedILPIs[ilpi] = false;
        emit ILPIRevoked(ilpi);
    }

    function isILPIAuthorized(address ilpi) external view returns (bool) {
        return authorizedILPIs[ilpi];
    }

    function createRecebivel(
        string memory name,
        string memory symbol,
        string memory ilpiName,
        uint256 discountValue,
        uint256 totalDebtValue,
        uint256 dueDate
    ) external {
        require(authorizedILPIs[msg.sender], "ILPI not authorized to create tokens");
        require(totalDebtValue > discountValue, "Total debt must be greater than discount value");
        require(dueDate > block.timestamp, "Due date must be in the future");
        
        uint8 ilpiRating = oracle.getILPIRating(msg.sender);
        require(ilpiRating >= 3, "ILPI rating too low"); // Rating mínimo 3/10

        RecebivelToken token = new RecebivelToken(
            name,
            symbol,
            ilpiName,
            discountValue,
            totalDebtValue,
            dueDate,
            msg.sender
        );

        tokens[tokenIdCounter] = TokenInfo(
            address(token), 
            msg.sender, 
            false,
            0,
            block.timestamp,
            ilpiRating
        );
        
        emit TokenCreated(tokenIdCounter, address(token), msg.sender, ilpiRating);
        tokenIdCounter++;
    }

    function purchaseToken(uint256 id) external payable {
        TokenInfo storage info = tokens[id];
        require(!info.redeemed, "Token already redeemed");

        RecebivelToken token = RecebivelToken(info.tokenAddress);
        uint256 discountValue = token.discountValue();
        address payable ilpi = payable(info.ilpi);

        require(msg.value == discountValue, "Incorrect payment amount");

        uint8 currentRating = oracle.getILPIRating(info.ilpi);
        require(currentRating >= 2, "ILPI rating too risky for purchase");

        uint256 currentBNBPrice = oracle.getBNBPrice();

        info.investmentAmount = msg.value;

        (bool sent, ) = ilpi.call{value: msg.value}("");
        require(sent, "Failed to send BNB to ILPI");

        require(token.transfer(msg.sender, 1 ether), "Token transfer failed");

        emit TokenPurchased(id, msg.sender, discountValue, currentBNBPrice);
    }

    function redeemToken(uint256 id) external {
        TokenInfo storage info = tokens[id];
        require(!info.redeemed, "Already redeemed");

        RecebivelToken token = RecebivelToken(info.tokenAddress);

        bool isPaidInRealWorld = oracle.isRecebivelPaid(id);
        
        if (isPaidInRealWorld) {

            _processEarlyRedemption(id, "Receivable paid early");
        } else if (block.timestamp >= token.dueDate()) {

            _processNormalRedemption(id);
        } else {
            revert("Token not due yet and not paid early");
        }
    }

    function _processNormalRedemption(uint256 id) internal {
        TokenInfo storage info = tokens[id];
        RecebivelToken token = RecebivelToken(info.tokenAddress);
        
        info.redeemed = true;

        uint256 totalDebtValue = token.totalDebtValue();
        uint256 investmentAmount = info.investmentAmount;

        uint256 payout = (totalDebtValue * investmentAmount) / token.discountValue();

        if (block.timestamp - info.creationTimestamp > 180 days) {
            uint256 inflationRate = oracle.getInflationRate();
            uint256 inflationAdjustment = payout * inflationRate / 10000;
            payout += inflationAdjustment;
        }

        (bool sent, ) = payable(msg.sender).call{value: payout}("");
        require(sent, "Redemption payment failed");

        emit TokenRedeemed(id, msg.sender, payout);
    }

    function _processEarlyRedemption(uint256 id, string memory reason) internal {
        TokenInfo storage info = tokens[id];
        RecebivelToken token = RecebivelToken(info.tokenAddress);
        
        info.redeemed = true;

        uint256 totalDebtValue = token.totalDebtValue();
        uint256 investmentAmount = info.investmentAmount;
        
        uint256 payout = (totalDebtValue * investmentAmount) / token.discountValue();

        (bool sent, ) = payable(msg.sender).call{value: payout}("");
        require(sent, "Early redemption payment failed");

        emit TokenRedeemedEarly(id, msg.sender, payout, reason);
    }


    function calculateAdjustedDiscount(
        uint256 originalDiscount,
        address ilpi
    ) external view returns (uint256) {
        uint8 rating = oracle.getILPIRating(ilpi);

        uint256 riskMultiplier = 1000 + (10 - rating) * baseRiskRate; 
        
        return originalDiscount * riskMultiplier / 1000;
    }

    function canRedeem(uint256 id) external view returns (bool, string memory) {
        TokenInfo memory info = tokens[id];
        
        if (info.redeemed) {
            return (false, "Already redeemed");
        }
        
        if (oracle.isRecebivelPaid(id)) {
            return (true, "Paid early");
        }
        
        RecebivelToken token = RecebivelToken(info.tokenAddress);
        if (block.timestamp >= token.dueDate()) {
            return (true, "Due date reached");
        }
        
        return (false, "Not due yet");
    }

    function getTokenInfoWithOracle(uint256 id) external view returns (
        TokenInfo memory info,
        uint8 currentILPIRating,
        bool isPaidInRealWorld,
        uint256 currentBNBPrice,
        uint256 marketRate,
        bool canRedeem_,
        string memory redeemReason
    ) {
        info = tokens[id];
        currentILPIRating = oracle.getILPIRating(info.ilpi);
        isPaidInRealWorld = oracle.isRecebivelPaid(id);
        currentBNBPrice = oracle.getBNBPrice();
        marketRate = oracle.getMarketInterestRate();
        
        (canRedeem_, redeemReason) = this.canRedeem(id);
    }

    function fundContract() external payable onlyOwner {}

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}