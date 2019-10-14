import del from "del";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";

import {projectPath} from "./helpers";

(async () => {
  const {ENVFILE} = process.env;

  if (!ENVFILE) throw new Error("ENVFILE environment variable not set.");

  const envFilePath = path.resolve("/tmp", "envfile");
  const iosProjectFilePath = path.resolve(projectPath, "ios", "App.xcodeproj", "project.pbxproj");

  if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
  fs.writeFileSync(envFilePath, ENVFILE);

  const env = dotenv.parse(fs.readFileSync(ENVFILE));

  // region Rename iOS Product Bundle Identifier
  const iosProjectFileData = fs.readFileSync(iosProjectFilePath, "utf-8");
  const bundleIdRegEx = /PRODUCT_BUNDLE_IDENTIFIER = (.+);/g;
  const prevAppId = (iosProjectFileData.match(bundleIdRegEx) || [""])[0].replace(bundleIdRegEx, "$1");

  let shouldCleanBuild = false;

  if (prevAppId !== env.APP_ID) {
    shouldCleanBuild = true;

    const newData = iosProjectFileData.replace(bundleIdRegEx, `PRODUCT_BUNDLE_IDENTIFIER = ${env.APP_ID};`);
    fs.writeFileSync(iosProjectFilePath, newData);
  }
  // endregion

  // region Update Bundle Display Name
  const infoPlistPath = path.resolve(projectPath, "ios", "App", "Info.plist");
  let infoPlistData = fs.readFileSync(infoPlistPath, "utf-8");
  const appDisplayNameIndex = infoPlistData.indexOf("<key>CFBundleDisplayName</key>");
  if (appDisplayNameIndex === -1) throw new Error("CFBundleDisplayName not found.");

  const prevAppDisplayName = (infoPlistData.substr(appDisplayNameIndex).match(/<string>(.+)<\/string>/) || [""])[0].replace(/<string>(.+)<\/string>/, "$1");

  if (prevAppDisplayName !== env.APP_DISPLAY_NAME) {
    shouldCleanBuild = true;

    const newData = infoPlistData.substr(0, appDisplayNameIndex) + infoPlistData.substr(appDisplayNameIndex).replace(/<string>(.+)<\/string>/, `<string>${env.APP_DISPLAY_NAME}</string>`);
    fs.writeFileSync(infoPlistPath, newData);

    infoPlistData = fs.readFileSync(infoPlistPath, "utf-8");
  }
  // endregion

  // region Update Bundle Name
  const appNameIndex = infoPlistData.indexOf("<key>CFBundleName</key>");
  if (appNameIndex === -1) throw new Error("CFBundleName not found.");

  const prevAppName = (infoPlistData.substr(appNameIndex).match(/<string>(.+)<\/string>/) || [""])[0].replace(/<string>(.+)<\/string>/, "$1");

  if (prevAppName !== env.APP_NAME) {
    shouldCleanBuild = true;

    const newData = infoPlistData.substr(0, appNameIndex) + infoPlistData.substr(appNameIndex).replace(/<string>(.+)<\/string>/, `<string>${env.APP_NAME}</string>`);
    fs.writeFileSync(infoPlistPath, newData);
  }
  // endregion

  // region Update android package
  const androidManifestPath = path.resolve(projectPath, "android", "app", "src", "main", "AndroidManifest.xml");
  const androidManifestData = fs.readFileSync(androidManifestPath, "utf-8");
  const newAndroidManifestData = androidManifestData.replace(/package="(.+)"/, `package="${env.APP_ID}"`);
  fs.writeFileSync(androidManifestPath, newAndroidManifestData);

  const javaFolder = path.resolve(projectPath, "android", "app", "src", "main", "java");

  const getJavaFilesFolder = (p = path.resolve(projectPath, "android", "app", "src", "main", "java")): string => {
    const content = fs.readdirSync(p).filter(f => f !== ".DS_Store");

    if (content.length < 1) throw new Error("Java files not found.");
    else if (content.length > 1) return p;

    return getJavaFilesFolder(path.join(p, content[0]));
  };

  const javaFilesFolder = getJavaFilesFolder();

  const mainActivityPath = path.join(javaFilesFolder, "MainActivity.java");
  const mainActivityData = fs.readFileSync(mainActivityPath, "utf-8");
  const newMainActivityData = mainActivityData.replace(/package (.+);/, `package ${env.APP_ID};`);
  fs.writeFileSync(mainActivityPath, newMainActivityData);

  const mainApplicationPath = path.join(javaFilesFolder, "MainApplication.java");
  const mainApplicationData = fs.readFileSync(mainApplicationPath, "utf-8");
  const newMainApplicationData = mainApplicationData.replace(/package (.+);/, `package ${env.APP_ID};`);
  fs.writeFileSync(mainApplicationPath, newMainApplicationData);

  const buckPath = path.resolve(projectPath, "android", "app", "BUCK");
  const buckData = fs.readFileSync(buckPath, "utf-8");
  const newBuckData = buckData.replace(/package = "(.+)"/g, `package = "${env.APP_ID}"`);
  fs.writeFileSync(buckPath, newBuckData);

  fs.renameSync(javaFilesFolder, path.join(javaFolder, "_"));
  const oldFolderName = fs.readdirSync(javaFolder).reduce((prev, current) => (current === "_" ? prev : current));
  await del(path.join(javaFolder, oldFolderName));
  const newFolders = env.APP_ID.split(".");
  let newPath = javaFolder;

  for (let i = 0; i < newFolders.length - 1; i++) {
    const newFolder = newFolders[i];

    newPath = path.join(newPath, newFolder);
    fs.mkdirSync(newPath);
  }

  fs.renameSync(path.join(javaFolder, "_"), path.join(newPath, newFolders[newFolders.length - 1]));
  // endregion

  const iosBuildFolder = path.resolve(projectPath, "ios", "build");
  if (shouldCleanBuild && fs.existsSync(iosBuildFolder)) await del(iosBuildFolder);
})();
