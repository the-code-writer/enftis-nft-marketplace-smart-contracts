import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotEnvConfig();

const hardhatConfig:HardhatUserConfig = {
  defaultNetwork: `${process.env.DEFAULT_NETWORK_NAME}`,
  etherscan: {
    apiKey: {
      sepolia: `${process.env.ETHERSCAN_API_KEY}`,
    }
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    /*
    hardhat: {
      forking: {
        url: `${process.env.ALCHEMY_URL_SEPOLIA}/${process.env.ALCHEMY_KEY}`,
        blockNumber: 3455485
      }
    },
    */
    sepolia: {
      url: `${process.env.ALCHEMY_URL_SEPOLIA}/${process.env.ALCHEMY_KEY}`,
      accounts: [`${process.env.DEPLOYER_ACCOUNT_KEY}`]
    }
  },
  solidity: {
    compilers: [
      {
        version: `${process.env.SOLC_COMPILER_VERSION}`,
        settings: {
          optimizer: {
            enabled: true,
            runs: 800,
            details: {
              yul: true
            }
          }
        }
      },
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 120000
  }
}

module.exports = hardhatConfig;
