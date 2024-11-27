// walletconnect.ts
import { ethers } from "ethers";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

/**
 * Conecta a carteira usando WalletConnect.
 * @returns {WalletConnect} O conector WalletConnect.
 */
export const connectWallet = async (): Promise<WalletConnect> => {
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Bridge padrão
    qrcodeModal: QRCodeModal,
    clientMeta: {
      description: "WalletConnect Developer App",
      url: "https://walletconnect.org",
      icons: ["https://walletconnect.org/walletconnect-logo.png"],
      name: "WalletConnect",
    },
  });

  // Verifica se já está conectado, caso contrário, cria uma nova sessão
  if (!connector.connected) {
    await connector.createSession();
  }

  // Escuta eventos de conexão
  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }
    const { accounts, chainId } = payload.params[0];
    console.log("Contas conectadas:", accounts);
    console.log("ID da cadeia:", chainId);
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }
    const { accounts, chainId } = payload.params[0];
    console.log("Sessão atualizada:", accounts, chainId);
  });

  connector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }
    console.log("Desconectado");
  });

  return connector;
};

/**
 * Retorna uma instância de contrato.
 * @param {ethers.Signer | ethers.providers.Provider} signerOrProvider - O assinante ou provedor do ethers.js.
 * @param {string} contractAddress - O endereço do contrato.
 * @param {any} contractABI - O ABI do contrato.
 * @returns {ethers.Contract} Instância do contrato.
 */
export const getContract = (
  signerOrProvider: ethers.Signer | ethers.Provider,
  contractAddress: string,
  contractABI: any
): ethers.Contract => {
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};