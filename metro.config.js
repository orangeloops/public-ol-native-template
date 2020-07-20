"use strict";

const {getDefaultConfig} = require("metro-config");
const fs = require("fs");
const {resolve} = require("path");

const ROOT_FOLDER = resolve(__dirname);

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    projectRoot: ROOT_FOLDER,
    transformer: {
      getTransformOptions: (_, {platform}) => {
        const moduleMap = {};

        const modulePaths = require(platform === "android" ? "./packager/modules.android" : "./packager/modules.ios");

        modulePaths.forEach(path => {
          if (fs.existsSync(path)) {
            moduleMap[resolve(path)] = true;
          }
        });

        return {
          preloadedModules: moduleMap,
          transform: {inlineRequires: {blacklist: moduleMap}},
        };
      },
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "jsx", "js", "json", "ts", "tsx", "svg"],
    },
  };
})();
