import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const privateKeyOwner = process.env.PRIVATE_KEY_OWNER || "";
const privateKeyAccount1 = process.env.PRIVATE_KEY_ACCOUNT1 || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "HTTP://127.0.0.1:8545",
    },
    manta: {
      url: "https://pacific-rpc.testnet.manta.network/http",
      chainId: 3441005,
      accounts: [privateKeyOwner, privateKeyAccount1],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: [privateKeyOwner, privateKeyAccount1],
    },
  },
};

export default config;
