import {codegen} from "@graphql-codegen/core";
import * as typescriptPlugin from "@graphql-codegen/typescript";
import * as typescriptResolversPlugin from "@graphql-codegen/typescript-resolvers";
import {loadSchema} from "@graphql-toolkit/core";
import {UrlLoader} from "@graphql-toolkit/url-loader";
import {CLIEngine} from "eslint";
import fs from "fs";
import {parse, printSchema} from "graphql";
import path from "path";

export const writeFile = (filePath: string, content: string) => {
  fs.writeFileSync(filePath, content);
  const output = new CLIEngine({
    fix: true,
  }).executeOnFiles([filePath]);
  fs.writeFileSync(filePath, output.results[0].output ?? content);
};

(async () => {
  const srcPath = path.resolve(__dirname, "..", "src");

  const remoteSchema = await loadSchema("http://localhost:5000/graphql", {loaders: [new UrlLoader()]});
  const remoteSchemaFilePath = path.resolve(srcPath, "core", "apiclients", "graphql", "GraphQLAPIClientSchema.ts");
  writeFile(remoteSchemaFilePath, 'import gql from "graphql-tag";\n\n' + "export const typeDefs = gql`" + printSchema(remoteSchema).replace(/`/g, "\\`") + "`");

  const remoteSchemaTypesFilePath = path.resolve(srcPath, "core", "apiclients", "graphql", "GraphQLAPIClientSchema.types.ts");
  const remoteSchemaTypesFileContent = await codegen({
    schema: parse(printSchema(remoteSchema)),
    documents: [],
    filename: remoteSchemaTypesFilePath,
    plugins: [
      {
        typescript: {},
      },
      {
        typescriptResolvers: {
          enumsAsTypes: true,
          noSchemaStitching: true,
          contextType: "{headers?: Record<string, string | undefined>}",
        },
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptResolvers: typescriptResolversPlugin,
    },
    config: {},
  });
  writeFile(remoteSchemaTypesFilePath, remoteSchemaTypesFileContent);
})();
