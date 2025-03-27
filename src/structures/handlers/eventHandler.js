const { loadFiles } = require("../functions/fileLoader");
const path = require("path");

async function loadEvents(bot) {
  if (bot.config.debug) bot.logger.time("Load");

  bot.events = new Map();
  const events = [];

  try {
    const files = await loadFiles("events");

    for (const f of files) {
      try {
        const event = require(f);

        // Validate event structure
        if (!event.name || typeof event.execute !== "function") {
          throw new Error(`Invalid event structure in file: ${f}`);
        }

        const execute = (...args) => event.execute(...args, bot);
        const target = event.rest ? bot.rest : bot;

        target[event.once ? "once" : "on"](event.name, execute);
        bot.events.set(event.name, execute);

        events.push({ Event: event.name, Status: "🟢" });
      } catch (err) {
        const fileName = path.basename(f, path.extname(f));
        events.push({ Event: fileName, Status: "🔴" });
        bot.logger.error(`Failed to load event from file: ${f}\nError: ${err.message}`);
      }
    }

    if (bot.config.table) console.table(events, ["Event", "Status"]);
    bot.logger.log("Loaded Events!", ["Handler", "Events"]);
  } catch (err) {
    bot.logger.error(`Error loading events: ${err.message}`);
  }

  if (bot.config.debug) bot.logger.timeEnd("Load", ["Handler", "Events"]);
}

module.exports = { loadEvents };