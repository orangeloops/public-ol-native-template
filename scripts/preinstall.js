const path = require("path");
const fs = require("fs");

const projectPath = path.join(__dirname, "..");
const pathToDelete = path.resolve(projectPath, "node_modules");

const deleteRecursive = p => {
  if (fs.lstatSync(p).isDirectory()) {
    fs.readdirSync(p).forEach(name => deleteRecursive(path.join(p, name)));
    fs.rmdirSync(p);
  } else fs.unlinkSync(p);
};

if (fs.existsSync(pathToDelete)) deleteRecursive(pathToDelete);
