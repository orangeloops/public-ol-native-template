import {Command, runCommand} from "./helpers";

(async () => {
  const commands: Command[] = [
    ["npm", ["run", "load-env"]],
    ["lint-staged", []],
  ];

  for (const command of commands) await runCommand(command);
})();
