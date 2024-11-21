import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  web3Provider: process.env.WEB3_PROVIDER || 'http://localhost:8545'
};