const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('three/examples/jsm/')) {
    const ruta = moduleName.replace('three/examples/jsm/', '');
    const base = path.resolve(__dirname, 'node_modules/three/examples/jsm', ruta);

    if (fs.existsSync(base)) {
      return { filePath: base, type: 'sourceFile' };
    }
    if (fs.existsSync(base + '.js')) {
      return { filePath: base + '.js', type: 'sourceFile' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
