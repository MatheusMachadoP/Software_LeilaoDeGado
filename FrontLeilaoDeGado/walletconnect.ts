import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateSecureRandom } from 'react-native-securerandom';

const getRandomBytes = (length: number) => {
  return new Promise<Uint8Array>((resolve, reject) => {
    generateSecureRandom(length)
      .then((randomBytes) => {
        resolve(new Uint8Array(randomBytes));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const connectWallet = async () => {
  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
    clientMeta: {
      description: "WalletConnect Developer App",
      url: "https://walletconnect.org",
      icons: ["https://walletconnect.org/walletconnect-logo.png"],
      name: "WalletConnect",
    },
  });

  // Check if connection is already established
  if (!connector.connected) {
    // Create a new session
    await connector.createSession();
  }

  return new Promise((resolve, reject) => {
    connector.on("connect", (error, payload) => {
      if (error) {
        reject(error);
      }

      // Get provided accounts and chainId
      const { accounts } = payload.params[0];
      resolve(accounts[0]);
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        reject(error);
      }

      // Get updated accounts and chainId
      const { accounts } = payload.params[0];
      resolve(accounts[0]);
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        reject(error);
      }

      reject("Disconnected");
    });
  });
};