import { ethers } from 'ethers';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import contractABI from './LeilaoABI.json';  // ABI do contrato gerado pelo Hardhat

declare global {
  interface Window {
    ethereum: any;
  }
}

const contractAddress = 'seu_endereco_do_contrato';

export class LeilaoService {
  private static provider: ethers.JsonRpcProvider;
  private static contract: ethers.Contract;
  static LeilaoService: Web3Provider;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      LeilaoService.provider = new Web3Provider(window.ethereum);
      LeilaoService.contract = new ethers.Contract(contractAddress, contractABI, LeilaoService.provider.getSigner());
    } else {
      throw new Error('Ethereum provider is not available');
    }
  }

  // Função para iniciar o leilão
  static async iniciarLeilao() {
    await this.contract.iniciarLeilao();
  }

  // Função para obter o maior lance
  static async obterMaiorLance() {
    return await this.contract.obterMaiorLance();
  }

  // Função para verificar o tempo restante
  static async obterTempoRestante() {
    const tempo = await this.contract.obterTempoRestante();
    return tempo.toString();  // ou qualquer outro formato necessário
  }

  // Função para verificar o status do leilão
  static async verificarStatusLeilao() {
    return await this.contract.statusLeilao();
  }

  // Função para dar um lance
  static async darLance(valor: number, nomeLicitante: string, cpfLicitante: string) {
    const valueInWei = ethers.utils.parseEther(valor.toString());
    await this.contract.darLance(valueInWei, nomeLicitante, cpfLicitante);
  }
}
