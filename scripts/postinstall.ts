import path from "path";

import {projectPath, runCommand} from "./helpers";

(async () => {
  require(path.resolve(projectPath, "node_modules", "react-native-modal-translucent", "scripts", "translucent-modal"));

  try {
    await runCommand(["pod", ["install"]], {
      cwd: path.resolve(projectPath, "ios"),
    });
  } catch (e) {
    console.log(`- Could not run \`pod install\`!`);
  }
})();
