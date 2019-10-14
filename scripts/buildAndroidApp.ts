import del from "del";
import fs from "fs-extra";
import path from "path";

import {projectPath, runCommand} from "./helpers";

(async () => {
  let pathToDelete = path.join(projectPath, "build");

  if (fs.existsSync(pathToDelete)) {
    await del(pathToDelete);
  }

  await runCommand(["npm", ["run", "load-env"]]);

  pathToDelete = path.resolve(projectPath, "android", "app", "build", "outputs", "apk", "release");

  if (fs.existsSync(pathToDelete)) {
    await del(pathToDelete);
  }

  await runCommand(["./gradlew", ["assembleRelease"]], {
    cwd: path.resolve(projectPath, "android"),
  });

  const pathToCreate = path.join(projectPath, "android", "build");

  if (!fs.existsSync(pathToCreate)) {
    fs.mkdirSync(pathToCreate);
  }

  const releaseApkPath = path.resolve(projectPath, "android", "app", "build", "outputs", "apk", "release", "app-release.apk");
  const debugApkPath = path.resolve(projectPath, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");
  const destFolder = path.resolve(projectPath, "android", "build");

  if (fs.existsSync(releaseApkPath)) fs.copyFileSync(releaseApkPath, path.resolve(destFolder, "app-release.apk"));
  else if (fs.existsSync(debugApkPath)) fs.copyFileSync(debugApkPath, path.resolve(destFolder, "app-debug.apk"));
})();
