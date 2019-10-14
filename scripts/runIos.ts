import {Command, runCommand} from "./helpers";

(async () => {
  const commands: Command[] = [["npm", ["run", "load-env"]], ["npm", ["run", "storyLoader"]], ["react-native", ["run-ios", "--scheme", "Development"]]];

  for (const command of commands) {
    await runCommand(command);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
})();
