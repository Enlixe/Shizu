const { loadFiles } = require("../functions/fileLoader");

const deleteCachedFile = (file) => {
  const resolvedPath = require.resolve(file);
  if (require.cache[resolvedPath]) delete require.cache[resolvedPath];
};

async function loadButtons(bot) {
  if (bot.config.debug) bot.logger.time("Load");
  const buttons = new Array();

  await bot.buttons.clear();

  const files = await loadFiles("buttons");

  for (const f of files) {
    try {
      deleteCachedFile(f);
      const btn = require(f);

      if (!btn.id || typeof btn.execute !== "function") {
        throw new Error(`Invalid button structure in file: ${f}`);
      }

      bot.buttons.set(btn.id, btn);

      buttons.push({ Buttons: btn.id, Status: "🟢" });
    } catch (err) {
      bot.logger.error(`Failed to load button from file ${f}: ${err.message}`, ["HANDLER"]);
      buttons.push({ Buttons: f.split("/").pop().slice(0, -3), Status: "🔴" });
    }
  }

  if (bot.config.table) console.table(buttons, ["Buttons", "Status"]);
  bot.logger.log("Loaded Buttons!", ["Handler", "Buttons"]);
  if (bot.config.debug) bot.logger.timeEnd("Load", ["Handler", "Buttons"]);
}
module.exports = { loadButtons };
