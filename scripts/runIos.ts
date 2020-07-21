import {Command, runCommand} from "./helpers";

(async () => {
  const commands: Command[] = [["react-native", ["run-ios", "--scheme", "Development", "--simulator", "iPhone 11"]]];

  for (const command of commands) {
    await runCommand(command);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
