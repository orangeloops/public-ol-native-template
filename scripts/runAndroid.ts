import {Command, runCommand} from "./helpers";

(async () => {
  const commands: Command[] = [
    ["npm", ["run", "load-env"]],
    ["react-native", ["run-android"]],
  ];

  for (const command of commands) {
    await runCommand(command);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
})();
