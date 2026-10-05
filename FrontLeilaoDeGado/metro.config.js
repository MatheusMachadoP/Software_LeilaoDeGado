const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// @walletconnect/modal-react-native declara "react-native": "src/index", mas o
// pacote publicado só traz lib/. Aponta para o build commonjs que existe.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@walletconnect/modal-react-native') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(
        __dirname,
        'node_modules/@walletconnect/modal-react-native/lib/commonjs/index.js'
      ),
    };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
