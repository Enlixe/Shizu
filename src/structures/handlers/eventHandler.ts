import { loadFiles } from "../functions/fileLoader";
import path from "path";
import { ShizuClient } from "../../ShizuClient"; // Import the CustomClient
import { Collection } from "discord.js"; // Ensure Collection is imported

interface Event {
  name: string;
  execute: (...args: any[]) => void;
  once?: boolean;
  rest?: boolean;
}

async function loadEvents(bot: ShizuClient) { // Use CustomClient type
  if (bot.config.debug) bot.logger.time("Load");

  // Initialize events as a Collection
  bot.events = new Collection<string, Function>();
  const events: { Event: string; Status: string }[] = [];

  try {
    const files = await loadFiles("events");

    for (const f of files) {
      try {
        const event: Event = require(f);

        // Validate event structure
        if (!event.name || typeof event.execute !== "function") {
          throw new Error(`Invalid event structure in file: ${f}`);
        }

        const execute = (...args: any[]) => event.execute(...args, bot);
        const target = event.rest ? bot.rest : bot;

        // Use type assertion to specify the type of target
        (target as ShizuClient)[event.once ? "once" : "on"](event.name, execute);
        bot.events.set(event.name, execute);

        events.push({ Event: event.name, Status: "🟢" });
      } catch (err: unknown) {
        if (err instanceof Error) {
          const fileName = path.basename(f, path.extname(f));
          events.push({ Event: fileName, Status: "🔴" });
          bot.logger.error(`Failed to load event from file: ${f}\nError: ${err.message}`);
        } else {
          const fileName = path.basename(f, path.extname(f));
          events.push({ Event: fileName, Status: "🔴" });
          bot.logger.error(`Failed to load event from file: ${f}\nError: ${String(err)}`);
        }
      }
    }

    if (bot.config.table) console.table(events, ["Event", "Status"]);
    bot.logger.log("Loaded Events!", ["Handler", "Events"]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      bot.logger.error(`Error loading events: ${err.message}`);
    } else {
      bot.logger.error(`Error loading events: ${String(err)}`);
    }
  }

  if (bot.config.debug) bot.logger.timeEnd("Load", ["Handler", "Events"]);
}

export { loadEvents };