import Web3 from 'web3';
import { config } from '../config';

const web3 = new Web3(config.web3Provider);

export const getBalance = async (address: string): Promise<string> => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
};