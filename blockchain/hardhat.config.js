require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

const { vars } = require("hardhat/config");
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const BNB_PRIVATE_KEY = vars.get("BNB_PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bnb: {
      url: `https://bnb-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [BNB_PRIVATE_KEY],
      chainId: 97, 
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: ETHERSCAN_API_KEY,
      bnb: ETHERSCAN_API_KEY, 
    },
    customChains: [
      {
        network: "bscTestnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com"
        }
      }
    ]
  }
};