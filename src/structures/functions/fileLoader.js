const { glob } = require("glob");
const path = require("path");

async function deleteCachedFile(file) {
  const filePath = path.resolve(file);
  if (require.cache[filePath]) delete require.cache[filePath];
}

async function loadFiles(dirName) {
  if (typeof dirName !== "string" || !dirName.trim()) {
    throw new Error("[FUNCTIONS] Invalid directory name provided.");
  }

  try {
    const files = await glob(
      path.join(process.cwd(), "src", dirName, "**/*.js").replace(/\\/g, "/")
    );
    const jsFiles = files.filter((file) => path.extname(file) === ".js");
    await Promise.all(jsFiles.map(deleteCachedFile));
    return jsFiles;
  } catch (err) {
    console.error(
      `[FUNCTIONS] Error loading files from directory ${dirName}: ${err.stack || err}`
    );
    throw err;
  }
}

module.exports = { loadFiles };