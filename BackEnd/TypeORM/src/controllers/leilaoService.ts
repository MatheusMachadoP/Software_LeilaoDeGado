import { ethers } from 'ethers';
import contractABI from './LeilaoABI.json';  // ABI do contrato gerado pelo Hardhat

const contractAddress = 'seu_endereco_do_contrato';

export class LeilaoService {
  private static provider: ethers.providers.JsonRpcProvider;
  private static contract: ethers.Contract;

  static initialize() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider.getSigner());
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
