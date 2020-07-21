require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
  },
});

require(`./${process.argv[2]}.ts`);
