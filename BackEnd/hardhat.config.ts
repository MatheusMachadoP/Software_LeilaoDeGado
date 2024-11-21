import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545'
    }
  }
};

export default config;