const { loadFiles } = require("../functions/fileLoader");

async function loadEvents(bot) {
  console.time("[HANDLER] - Loaded Events");

  bot.events = new Map();
  const events = new Array();

  const files = await loadFiles("events");

  for (const f of files) {
    try {
      const event = require(f);
      const execute = (...args) => event.execute(...args, bot);
      const target = event.rest ? bot.rest : bot;

      target[event.once ? "once" : "on"](event.name, execute);
      bot.events.set(event.name, execute);

      events.push({ Event: event.name, Status: "🟢" });
    } catch (err) {
      events.push({ Event: f.split("/").pop().slice(0, -3), Status: "🔴" });
    }
  }

  console.table(events, ["Event", "Status"]);
  bot.logger.log("Loaded Events!", ["HANDLER"]);
  // console.info("\n\x1b[36m%s\x1b[0m", "[HANDLER] Loaded Events.");
  console.timeEnd("[HANDLER] - Loaded Events");
}

module.exports = { loadEvents };
