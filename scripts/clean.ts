import del from "del";
import fs from "fs-extra";
import path from "path";

import {Command, projectPath, runCommand} from "./helpers";

(async () => {
  const {TMPDIR, appdata} = process.env;

  try {
    await runCommand(["watchman", ["watch-del-all"]]);
  } catch (e) {
    console.log("- Could not delete watchman cache!");
  }

  const pathsToDelete = [];

  if (appdata && path.isAbsolute(appdata)) {
    const tmpDir = path.resolve(appdata, "Temp");

    if (fs.existsSync(tmpDir) && fs.lstatSync(tmpDir).isDirectory())
      pathsToDelete.push(
        ...fs
          .readdirSync(tmpDir)
          .filter(n => n.startsWith("react-native-"))
          .map(n => path.resolve(tmpDir, n))
      );
  }

  await runCommand(["./gradlew", ["clean"]], {
    cwd: path.resolve(projectPath, "android"),
  });

  if (TMPDIR !== undefined)
    pathsToDelete.push(
      ...fs
        .readdirSync(TMPDIR)
        .filter(i => i === "metro-bundler-cache" || i.startsWith("react-") || i.startsWith("haste-map-react-native-packager-"))
        .map(i => path.join(TMPDIR, i))
    );

  pathsToDelete.push(...[path.join(projectPath, "node_modules"), path.join(projectPath, "package-lock.json"), path.join(projectPath, "ios", "build")].filter(p => fs.existsSync(p)));

  try {
    await del(pathsToDelete, {force: true});
  } catch (e) {
    await del(pathsToDelete, {force: true});
  }

  const commands: Command[] = [["npm", ["cache", "verify"]], ["npm", ["install"]]];
  for (const command of commands) await runCommand(command);
})();
