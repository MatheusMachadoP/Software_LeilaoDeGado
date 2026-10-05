import { ethers } from "ethers";
import contractJson from "./LeilaoDeGado.contract.json";

const { abi, bytecode } = contractJson;

let provider: ethers.JsonRpcProvider | undefined;
let wallet: ethers.Wallet | undefined;

function getWallet(): ethers.Wallet {
  if (!wallet) {
    if (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY) {
      throw new Error("SEPOLIA_RPC_URL ou PRIVATE_KEY não configurados no .env");
    }
    provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  }
  return wallet;
}

export interface DadosNovoLeilao {
  nomeAtivo: string;
  precoInicial: number;
  duracaoRodadaSegundos: number;
  numeroRodadas: number;
  data: string;
}

// O contrato compara "_valor * 1000" contra precoInicial (ver darLance no .sol),
// então escalamos precoInicial por 1000 aqui para que os dois lados fiquem na mesma unidade
// sem precisar tocar no Solidity já existente.
const ESCALA_PRECO = 1000;

export async function deployLeilaoContract(dados: DadosNovoLeilao) {
  const signer = getWallet();
  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  const precoInicialEscalado = Math.round(dados.precoInicial * ESCALA_PRECO);

  const contract = await factory.deploy(
    dados.nomeAtivo,
    precoInicialEscalado,
    dados.duracaoRodadaSegundos,
    dados.numeroRodadas,
    dados.data
  );

  const deployTx = contract.deploymentTransaction();
  await contract.waitForDeployment();

  const endereco = await contract.getAddress();

  const iniciarTx = await (contract as ethers.Contract).iniciarLeilao();
  await iniciarTx.wait();

  return {
    endereco,
    txHashCriacao: deployTx?.hash ?? "",
  };
}

export async function darLanceOnChain(enderecoContrato: string, valor: number, nome: string, cpf: string) {
  const signer = getWallet();
  const contract = new ethers.Contract(enderecoContrato, abi, signer);

  const valorInteiro = Math.round(valor);
  const tx = await contract.darLance(valorInteiro, nome, cpf);
  const receipt = await tx.wait();

  return { txHash: receipt.hash as string };
}

export async function finalizarLeilaoOnChain(enderecoContrato: string) {
  const signer = getWallet();
  const contract = new ethers.Contract(enderecoContrato, abi, signer);

  const tx = await contract.finalizarLeilao();
  const receipt = await tx.wait();

  return { txHash: receipt.hash as string };
}
