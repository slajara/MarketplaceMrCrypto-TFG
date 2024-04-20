import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        //0-1000 a menos mas barato, mas caro interactuar, y al reves
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    polygonMumbai: {
      url: process.env.PROVIDER_URL_MUMBAI || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
    },
  },
};

export default config;
