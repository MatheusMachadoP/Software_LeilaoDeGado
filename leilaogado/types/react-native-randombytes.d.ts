declare module 'react-native-randombytes' {
    export function randomBytes(size: number): Uint8Array;
    export function generateSecureRandom(size: number): Promise<Uint8Array>;
  }

  declare module 'react-native-crypto' {

    function randomBytes(length: number): Uint8Array;

    export default {

        randomBytes

    };

}
