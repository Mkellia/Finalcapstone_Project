import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config({ path: '.env.local' });

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || '';
const deployerPk = process.env.DEPLOYER_PRIVATE_KEY || '';
const hasRealSepoliaConfig =
  sepoliaUrl.length > 0 &&
  !sepoliaUrl.includes('YOUR_INFURA_KEY') &&
  deployerPk.length === 64 &&
  !deployerPk.includes('your-wallet-private-key');

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: hasRealSepoliaConfig
    ? {
        sepolia: {
          url: sepoliaUrl,
          accounts: [deployerPk],
        },
      }
    : {},
};

export default config;
