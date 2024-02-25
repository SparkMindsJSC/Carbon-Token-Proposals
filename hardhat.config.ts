import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const privateKeyOwner = process.env.PRIVATE_KEY_OWNER || "";
const privateKeyAccount1 = process.env.PRIVATE_KEY_OWNER || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
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
  },
};

export default config;
