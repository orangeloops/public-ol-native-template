import del from "del";
import fs from "fs-extra";
import path from "path";

import {Command, projectPath, runCommand} from "./helpers";

(async () => {
  const pathsToDelete = [path.join(projectPath, "node_modules"), path.join(projectPath, "package-lock.json")];
  let deletedPaths: string[];

  try {
    deletedPaths = await del(pathsToDelete.filter((p) => fs.existsSync(p)));
  } catch (e) {
    deletedPaths = await del(pathsToDelete.filter((p) => fs.existsSync(p)));
  }
  console.log("Deleted files and directories:\n", deletedPaths.join("\n"));

  const commands: Command[] = [
    ["npm", ["cache", "clean", "--force"]],
    ["npm", ["rebuild"]],
    ["npm", ["install"]],
  ];
  for (const command of commands) await runCommand(command);
})();
