// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// molde pra cada token comprado pelo investidor
contract TokenRecebivel is ERC20, Ownable {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _ilpi
    ) ERC20(_name, _symbol) {
        _mint(_ilpi, _totalSupply);
        transferOwnership(_ilpi);
    }
}

// contrato que vai reger a criação dos tokens para cada fração da dívida
contract RecebivelFactory is Ownable {
    uint256 public contadorRecebiveis;

    struct Recebivel {
        address ilpi;
        address tokenAddress;
        uint256 valorTotal;
        uint256 prazoDias;
        uint256 rentabilidadeAnual;
        uint256 valorVendido;
    }

    mapping(uint256 => Recebivel) public recebiveis;
    mapping(address => bool) public ilpisAutorizadas; // verifica se a ilpi que tá criando o recebível realmente é autorizada

    address public stablecoin; // decidir stablecoin ainda

    event RecebivelCriado(uint256 indexed id, address token, address ilpi);
    event TokenComprado(uint256 indexed idRecebivel, address investidor, uint256 quantidade);

    constructor(address _stablecoin) {
        stablecoin = _stablecoin;
    }

    // dá o acesso para a ILPI criar os recebíveis
    function autorizarILPI(address _ilpi) external onlyOwner {
        ilpisAutorizadas[_ilpi] = true;
    }

    /// @notice Cria um novo token de recebível ERC20 representando uma dívida fracionada
    function criarRecebivel(
        string memory _nome,
        string memory _simbolo,
        uint256 _valorTotal,
        uint256 _prazoDias,
        uint256 _rentabilidadeAnual
    ) external {
        require(ilpisAutorizadas[msg.sender], "ILPI nao autorizada");

        TokenRecebivel novoToken = new TokenRecebivel(
            _nome,
            _simbolo,
            _valorTotal,
            msg.sender
        );

        recebiveis[contadorRecebiveis] = Recebivel({
            ilpi: msg.sender,
            tokenAddress: address(novoToken),
            valorTotal: _valorTotal,
            prazoDias: _prazoDias,
            rentabilidadeAnual: _rentabilidadeAnual,
            valorVendido: 0
        });

        emit RecebivelCriado(contadorRecebiveis, address(novoToken), msg.sender);
        contadorRecebiveis++;
    }

    // função para permitir a compra dos tokens pelos investidores
    function comprarTokens(uint256 idRecebivel, uint256 quantidade) external {
        Recebivel storage r = recebiveis[idRecebivel];
        require(r.tokenAddress != address(0), "Recebivel inexistente");
        require(r.valorVendido + quantidade <= r.valorTotal, "Nao ha tokens suficientes");

        IERC20 stable = IERC20(stablecoin);

        // Transferência da stablecoin do investidor para a ILPI
        require(stable.transferFrom(msg.sender, r.ilpi, quantidade), "Transferencia falhou");

        // Transferência dos tokens do recebível da ILPI para o investidor
        IERC20(r.tokenAddress).transferFrom(r.ilpi, msg.sender, quantidade);

        r.valorVendido += quantidade;
        emit TokenComprado(idRecebivel, msg.sender, quantidade);
    }

    // puxa os dados de um recebível específico
    function getRecebivel(uint256 id) external view returns (Recebivel memory) {
        return recebiveis[id];
    }
}
