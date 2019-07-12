"use strict";

module.exports = function(api) {
  api.cache(false);

  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      "@babel/plugin-transform-react-jsx-source",
      "@babel/plugin-transform-runtime",
      "@babel/plugin-transform-flow-strip-types",
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true,
        },
      ],
      "lodash",
    ],
  };
};
