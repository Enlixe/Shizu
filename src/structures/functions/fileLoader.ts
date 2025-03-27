import { glob } from "glob";
import path from "path";

async function deleteCachedFile(file: string) {
  const filePath = path.resolve(file);
  if (require.cache[filePath]) delete require.cache[filePath];
}

async function loadFiles(dirName: string): Promise<string[]> {
  if (typeof dirName !== "string" || !dirName.trim()) {
    throw new Error("[FUNCTIONS] Invalid directory name provided.");
  }

  try {
    const files = await glob(
      path.join(process.cwd(), "src", dirName, "**/*.ts").replace(/\\/g, "/")
    );
    const jsFiles = files.filter((file) => path.extname(file) === ".ts");
    await Promise.all(jsFiles.map(deleteCachedFile));
    return jsFiles;
  } catch (err: any) {
    console.error(
      `[FUNCTIONS] Error loading files from directory ${dirName}: ${err.stack || err}`
    );
    throw err;
  }
}

export { loadFiles };