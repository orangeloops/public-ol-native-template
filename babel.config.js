"use strict";

module.exports = function(api) {
  api.cache(false);

  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      "@babel/plugin-transform-react-jsx-source",
      "@babel/plugin-transform-flow-strip-types",
      ["@babel/plugin-proposal-decorators", {legacy: true}],
      ["@babel/plugin-proposal-class-properties", {loose: true}],
      "@babel/plugin-transform-runtime",
      "lodash",
    ],
  };
};
