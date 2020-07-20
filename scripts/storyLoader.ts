import fs from "fs-extra";
import path from "path";

const srcPath = path.resolve(__dirname, "..", "src");

const getAllStoryFiles = (filePath: string): string[] => {
  if (fs.statSync(filePath).isDirectory()) return fs.readdirSync(filePath).reduce<string[]>((res, value) => [...res, ...getAllStoryFiles(path.resolve(filePath, value))], []);

  return filePath.endsWith("stories.tsx") ? [filePath] : [];
};

export const storyLoader = async () => {
  const storyFiles = getAllStoryFiles(srcPath);

  const stories = storyFiles.reduce<{file: string; story: string}[]>((res, value) => {
    const storyNameMatch = fs
      .readFileSync(value, {
        encoding: "utf8",
      })
      .match(/storiesOf\("(.+?)"/);

    if (storyNameMatch) return [...res, {file: value, story: storyNameMatch[1]}];

    return res;
  }, []);

  fs.writeFileSync(
    path.join(srcPath, "..", "storybook", "storyLoader.ts"),
    `export const loadStories = () => {
${stories
  .sort((a, b) => a.story.localeCompare(b.story))
  .map((i) => `    require("${path.relative(path.resolve(srcPath, "..", "storybook"), i.file).replace(/\\/g, "/")}");\n`)
  .join("")}
};
`
  );
};
