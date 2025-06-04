// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IRecebivelOracle {
    function getBNBPrice() external view returns (uint256);
    function getILPIRating(address ilpi) external view returns (uint8);
    function isRecebivelPaid(uint256 tokenId) external view returns (bool);
    function getMarketInterestRate() external view returns (uint256);
    function getInflationRate() external view returns (uint256);
}

contract RecebivelOracle is Ownable, IRecebivelOracle {
    
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        bool isValid;
    }
    
    struct ILPIRatingData {
        uint8 rating; 
        uint256 lastUpdated;
        bool isActive;
    }
    
    struct RecebivelStatus {
        bool isPaid;
        uint256 paidDate;
        uint256 lastChecked;
    }
    
    PriceData public bnbPrice;
    
    mapping(address => ILPIRatingData) public ilpiRatings;
    
    mapping(uint256 => RecebivelStatus) public recebivelStatus;
    
    uint256 public marketInterestRate;
    uint256 public marketRateLastUpdate;

    uint256 public inflationRate;
    uint256 public inflationLastUpdate;

    mapping(address => bool) public authorizedOracles;

    event PriceUpdated(uint256 newPrice, uint256 timestamp);
    event ILPIRatingUpdated(address indexed ilpi, uint8 rating);
    event RecebivelStatusUpdated(uint256 indexed tokenId, bool isPaid);
    event MarketRateUpdated(uint256 newRate);
    event InflationRateUpdated(uint256 newRate);
    event OracleAuthorized(address indexed oracle);
    event OracleRevoked(address indexed oracle);
    
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender] || msg.sender == owner(), "Not authorized oracle");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        bnbPrice = PriceData(1200 * 1e18, block.timestamp, true); 
        marketInterestRate = 1200; 
        inflationRate = 450; 
        marketRateLastUpdate = block.timestamp;
        inflationLastUpdate = block.timestamp;
    }
    
    function authorizeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = true;
        emit OracleAuthorized(oracle);
    }
    
    function revokeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
        emit OracleRevoked(oracle);
    }

    function updateBNBPrice(uint256 _price) external onlyAuthorizedOracle {
        require(_price > 0, "Invalid price");
        bnbPrice = PriceData(_price, block.timestamp, true);
        emit PriceUpdated(_price, block.timestamp);
    }

    function updateILPIRating(address ilpi, uint8 rating) external onlyAuthorizedOracle {
        require(rating >= 1 && rating <= 10, "Rating must be between 1-10");
        ilpiRatings[ilpi] = ILPIRatingData(rating, block.timestamp, true);
        emit ILPIRatingUpdated(ilpi, rating);
    }

    function markRecebivelAsPaid(uint256 tokenId) external onlyAuthorizedOracle {
        recebivelStatus[tokenId] = RecebivelStatus(true, block.timestamp, block.timestamp);
        emit RecebivelStatusUpdated(tokenId, true);
    }

    function updateMarketInterestRate(uint256 rate) external onlyAuthorizedOracle {
        require(rate <= 5000, "Rate too high"); // Max 50%
        marketInterestRate = rate;
        marketRateLastUpdate = block.timestamp;
        emit MarketRateUpdated(rate);
    }
    
    function updateInflationRate(uint256 rate) external onlyAuthorizedOracle {
        require(rate <= 2000, "Inflation rate too high"); // Max 20%
        inflationRate = rate;
        inflationLastUpdate = block.timestamp;
        emit InflationRateUpdated(rate);
    }
 
    function getBNBPrice() external view override returns (uint256) {
        require(bnbPrice.isValid, "Price data not available");
        require(block.timestamp - bnbPrice.timestamp <= 1 hours, "Price data too old");
        return bnbPrice.price;
    }
    
    function getILPIRating(address ilpi) external view override returns (uint8) {
        ILPIRatingData memory rating = ilpiRatings[ilpi];
        require(rating.isActive, "ILPI rating not available");
        require(block.timestamp - rating.lastUpdated <= 30 days, "Rating data too old");
        return rating.rating;
    }
    
    function isRecebivelPaid(uint256 tokenId) external view override returns (bool) {
        return recebivelStatus[tokenId].isPaid;
    }
    
    function getMarketInterestRate() external view override returns (uint256) {
        require(block.timestamp - marketRateLastUpdate <= 1 days, "Market rate data too old");
        return marketInterestRate;
    }
    
    function getInflationRate() external view override returns (uint256) {
        require(block.timestamp - inflationLastUpdate <= 7 days, "Inflation data too old");
        return inflationRate;
    }

    function isPriceDataFresh() external view returns (bool) {
        return block.timestamp - bnbPrice.timestamp <= 1 hours;
    }
    
    function getDataFreshness() external view returns (
        uint256 priceAge,
        uint256 marketRateAge,
        uint256 inflationAge
    ) {
        priceAge = block.timestamp - bnbPrice.timestamp;
        marketRateAge = block.timestamp - marketRateLastUpdate;
        inflationAge = block.timestamp - inflationLastUpdate;
    }
}