import del from "del";
import fs from "fs-extra";
import path from "path";

import {projectPath, runCommand} from "./helpers";

(async () => {
  const pathToDelete = path.join(projectPath, "build");

  if (fs.existsSync(pathToDelete)) await del(pathToDelete);

  await runCommand(["react-native", ["start", ...process.argv.slice(3)]]);
})();
