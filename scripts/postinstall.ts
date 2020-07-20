import {runCommand} from "./helpers";

(async () => {
  try {
    await runCommand(["pod", ["install"]], {
      cwd: "ios",
    });
  } catch (e) {
    console.log(`- Could not run \`pod install\`!`);
  }

  try {
    await runCommand(["patch-package", []]);
  } catch (e) {
    console.log(`- Could not run \`patch-package\`!`);
  }

  process.exit(0);
})();
