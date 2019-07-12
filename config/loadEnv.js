const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envFilePath = "/tmp/envfile";
const iosProjectFilePath = "./ios/App.xcodeproj/project.pbxproj";

const deleteFolderRecursive = p => {
  if (fs.existsSync(p)) {
    fs.readdirSync(p).forEach(file => {
      const curPath = path.join(p, file);

      if (fs.lstatSync(curPath).isDirectory()) deleteFolderRecursive(curPath);
      else fs.unlinkSync(curPath);
    });

    fs.rmdirSync(p);
  }
};

if (fs.existsSync(envFilePath)) fs.unlinkSync(envFilePath);
fs.writeFileSync(envFilePath, process.env.ENVFILE);

const env = dotenv.parse(fs.readFileSync(process.env.ENVFILE));

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
const infoPlistPath = "./ios/App/Info.plist";
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
const androidManifestPath = "./android/app/src/main/AndroidManifest.xml";
const androidManifestData = fs.readFileSync(androidManifestPath, "utf-8");
const newAndroidManifestData = androidManifestData.replace(/package="(.+)"/, `package="${env.APP_ID}"`);
fs.writeFileSync(androidManifestPath, newAndroidManifestData);

const javaFolder = "./android/app/src/main/java";

const getJavaFilesFolder = (p = "./android/app/src/main/java") => {
  const content = fs.readdirSync(p).filter(f => f !== ".DS_Store");

  if (content.length < 1) throw new Error("Java files not found.");
  else if (content.length > 1) return p;

  return getJavaFilesFolder(path.join(p, content[0]));
};

let javaFilesFolder = getJavaFilesFolder();

const mainActivityPath = path.join(javaFilesFolder, "MainActivity.java");
const mainActivityData = fs.readFileSync(mainActivityPath, "utf-8");
const newMainActivityData = mainActivityData.replace(/package (.+);/, `package ${env.APP_ID};`);
fs.writeFileSync(mainActivityPath, newMainActivityData);

const mainApplicationPath = path.join(javaFilesFolder, "MainApplication.java");
const mainApplicationData = fs.readFileSync(mainApplicationPath, "utf-8");
const newMainApplicationData = mainApplicationData.replace(/package (.+);/, `package ${env.APP_ID};`);
fs.writeFileSync(mainApplicationPath, newMainApplicationData);

const buckPath = "./android/app/BUCK";
const buckData = fs.readFileSync(buckPath, "utf-8");
const newBuckData = buckData.replace(/package = "(.+)"/g, `package = "${env.APP_ID}"`);
fs.writeFileSync(buckPath, newBuckData);

fs.renameSync(javaFilesFolder, path.join(javaFolder, "_"));
const oldFolderName = fs.readdirSync(javaFolder).reduce((prev, current) => (current === "_" ? prev : current));
deleteFolderRecursive(path.join(javaFolder, oldFolderName));
const newFolders = env.APP_ID.split(".");
let newPath = javaFolder;

for (let i = 0; i < newFolders.length - 1; i++) {
  const newFolder = newFolders[i];

  newPath = path.join(newPath, newFolder);
  fs.mkdirSync(newPath);
}

fs.renameSync(path.join(javaFolder, "_"), path.join(newPath, newFolders[newFolders.length - 1]));
// endregion

const iosBuildFolder = "./ios/build";
if (shouldCleanBuild && fs.existsSync(iosBuildFolder)) deleteFolderRecursive(iosBuildFolder);
