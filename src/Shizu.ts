import { GatewayIntentBits, Partials } from "discord.js";
import mongoose, { ConnectOptions } from "mongoose";

import { ShizuClient } from "./ShizuClient";
import config from "./config";

import { loadEvents } from "./structures/handlers/eventHandler";
import { loadCommands } from "./structures/handlers/commandHandler";
// import { loadButtons } from "./structures/handlers/buttonHandler";
// import loadEventListeners from "./structures/handlers/eventListeners";

const bot = new ShizuClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember],
});

bot.config = config

async function connectToDatabase(uri: string, retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
      bot.logger.log("Connected to the MongoDB database.", ["Bot", "DB"]);
      return;
    } catch (error: Error | any) {
      bot.logger.error(
        `Database connection failed (attempt ${i + 1}/${retries}): ${error.message}`,
        ["Bot", "DB"]
      );
      if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
    }
  }
  bot.logger.error(
    "Failed to connect to the database after multiple attempts.",
    ["Bot", "DB"]
  );
  process.exit(1);
}

(async () => {
  try {
    await bot.login(bot.config.token);
    bot.logger.setDebug(bot.config.debug);

    bot.logger.debug("Loading events...", ["Bot", "Init"]);
    await loadEvents(bot);

    // bot.logger.debug("Loading buttons...", ["Bot", "Init"]);
    // await loadButtons(bot);

    bot.logger.debug("Connecting to the database...", ["Bot", "Init"]);
    await connectToDatabase(bot.config.database);

    bot.logger.debug("Loading commands...", ["Bot", "Init"]);
    await loadCommands(bot);

    // loadEventListeners(bot);
  } catch (error: Error | any) {
    bot.logger.error(`Error during bot initialization: ${error.stack}`, ["Bot", "Error"]);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  bot.logger.warn("Process terminated. Cleaning up...", ["Bot", "Shutdown"]);
  await bot.destroy();
  await mongoose.connection.close();
  process.exit(0);
});