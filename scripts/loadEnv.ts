import del from "del";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";

import {projectPath} from "./helpers";
import {storyLoader} from "./storyLoader";

(async () => {
  const {DEFAULT_ENVFILE} = process.env;
  let {ENVFILE} = process.env;

  if (!ENVFILE) {
    if (!DEFAULT_ENVFILE) throw new Error("ENVFILE environment variable not set.");

    ENVFILE = DEFAULT_ENVFILE;
  }

  const envFilePath = path.resolve("/tmp", "envfile");

  const iosFolderPath = path.resolve(projectPath, "ios");
  const iosProjectFilePath = path.resolve(iosFolderPath, "App.xcodeproj", "project.pbxproj");

  if (process.platform === "darwin") {
    if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
    fs.writeFileSync(envFilePath, ENVFILE);
  }

  const defaultEnv = dotenv.parse(fs.readFileSync(".env"));
  const env = fs.existsSync(ENVFILE) ? dotenv.parse(fs.readFileSync(ENVFILE)) : {};
  let envContent = "";

  console.log("Using env file:", ENVFILE);
  Object.keys(defaultEnv).forEach((key) => {
    const processValue = process.env[key];

    if (processValue !== undefined) {
      env[key] = processValue;
      console.log("process value used for ", key);
    } else if (env[key] === undefined) {
      env[key] = defaultEnv[key];
      console.log("default env value used for ", key);
    } else console.log("specific env value used for", key);

    envContent += `${key}=${env[key]}\n`;
  });
  fs.writeFileSync(ENVFILE, envContent);
  fs.writeFileSync(path.resolve(iosFolderPath, "tmp.xcconfig"), envContent);

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

  const uiViewControlledStatusBarIndex = infoPlistData.indexOf("<key>UIViewControllerBasedStatusBarAppearance</key>");
  const prevUIViewControlledStatusBar = (infoPlistData.substr(uiViewControlledStatusBarIndex).match(/<(.+)\/>/) || [""])[0].replace(/<(.+)\/>/, "$1");

  if (prevUIViewControlledStatusBar === "true") {
    shouldCleanBuild = true;

    const newData = infoPlistData.substr(0, uiViewControlledStatusBarIndex) + infoPlistData.substr(uiViewControlledStatusBarIndex).replace(/<(.+)\/>/, `<false/>`);
    fs.writeFileSync(infoPlistPath, newData);
  }

  if (uiViewControlledStatusBarIndex === -1) throw new Error("UIViewControllerBasedStatusBarAppearance not found.");

  // endregion

  // region Update android package
  const androidManifestPath = path.resolve(projectPath, "android", "app", "src", "main", "AndroidManifest.xml");
  const androidManifestData = fs.readFileSync(androidManifestPath, "utf-8");
  const newAndroidManifestData = androidManifestData.replace(/package="(.+)"/, `package="${env.APP_ID}"`);
  fs.writeFileSync(androidManifestPath, newAndroidManifestData);

  const javaFolder = path.resolve(projectPath, "android", "app", "src", "main", "java");

  const getJavaFilesFolder = (p = path.resolve(projectPath, "android", "app", "src", "main", "java")): string => {
    const content = fs.readdirSync(p).filter((f) => f !== ".DS_Store");

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

  const buckPath = path.resolve(projectPath, "android", "app", "_BUCK");
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

  await storyLoader();
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
