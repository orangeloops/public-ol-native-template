const {execSync} = require("child_process");
const fs = require("fs");
const path = require("path");

const deleteRecursive = (p) => {
  if (fs.lstatSync(p).isDirectory()) {
    fs.readdirSync(p).forEach((name) => deleteRecursive(path.join(p, name)));
    fs.rmdirSync(p);
  } else fs.unlinkSync(p);
};

(async () => {
  const {TMPDIR, appdata} = process.env;

  const projectPath = path.resolve(__dirname, "..");
  const pathsToDelete = [
    path.resolve(projectPath, "node_modules"),
    path.resolve(projectPath, "package-lock.json"),
    path.resolve(projectPath, "ios", "Pods"),
    path.resolve(projectPath, "ios", "Podfile.lock"),
    path.resolve(projectPath, "tmp.xcconfig"),
  ];

  if (appdata && path.isAbsolute(appdata)) {
    const tmpDir = path.resolve(appdata, "Temp");

    if (fs.existsSync(tmpDir) && fs.lstatSync(tmpDir).isDirectory())
      pathsToDelete.push(
        ...fs
          .readdirSync(tmpDir)
          .filter((n) => n.startsWith("react-native-"))
          .map((n) => path.resolve(tmpDir, n))
      );
  }

  if (TMPDIR !== undefined)
    pathsToDelete.push(
      ...fs
        .readdirSync(TMPDIR)
        .filter((i) => i === "metro-bundler-cache" || i.startsWith("react-") || i.startsWith("haste-map-react-native-packager-"))
        .map((i) => path.join(TMPDIR, i))
    );

  for (const pathToDelete of pathsToDelete)
    if (fs.existsSync(pathToDelete)) {
      console.log(`Deleting ${path.relative(projectPath, pathToDelete)}...`);
      deleteRecursive(pathToDelete);
    }

  const commands = ["watchman watch-del-all", "npm cache verify", "npm i", "./gradlew clean"];
  const failedCommands = [];

  for (const command of commands)
    try {
      console.log(`Running \`${command}\``);
      execSync(command, {
        cwd: path.resolve(projectPath, "android"),
        stdio: "inherit",
      });
    } catch (e) {
      failedCommands.push(command);
      console.log(`[WARNING]: Could not run \`${command}\``);
    }

  if (failedCommands.length > 0) {
    console.log(`[WARNING]: Could not run the following commands:`);
    console.log(failedCommands.join("\n"));
  } else console.log(`[SUCCESS]: Commands ran successfully`);
})();
