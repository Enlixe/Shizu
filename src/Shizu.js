const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const mongoose = require("mongoose");
const { connect } = mongoose;
const Logger = require("./structures/functions/logger"),
  // { loadConfig } = require("./structures/functions/configLoader"),
  { loadEvents } = require("./structures/handlers/eventHandler"),
  { loadButtons } = require("./structures/handlers/buttonHandler"),
  { loadCommands } = require("./structures/handlers/commandHandler"),
  loadEventListeners = require("./structures/handlers/eventListeners");

const bot = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildPresences,
    MessageContent,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

bot.events = new Collection();
bot.commands = new Collection();
bot.subCommands = new Collection();
bot.buttons = new Collection();
bot.guildConfig = new Collection();

bot.logger = new Logger();
bot.config = require("./config.js");

async function connectToDatabase(uri, retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await connect(uri);
      bot.logger.log("Connected to the MongoDB database.", ["Bot", "DB"]);
      return;
    } catch (error) {
      bot.logger.error(
        `Database connection failed (attempt ${i + 1}/${retries}): ${
          error.message
        }`,
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
    bot.logger.setDebug(true);

    bot.logger.debug("Loading events...", ["Bot", "Init"]);
    await loadEvents(bot);

    bot.logger.debug("Loading buttons...", ["Bot", "Init"]);
    await loadButtons(bot);

    bot.logger.debug("Connecting to the database...", ["Bot", "Init"]);
    await connectToDatabase(bot.config.database);

    // bot.logger.debug("Loading configurations...", ["Bot", "Init"]);
    // await loadConfig(bot);

    bot.logger.debug("Loading commands...", ["Bot", "Init"]);
    await loadCommands(bot);

    loadEventListeners(bot);
  } catch (error) {
    bot.logger.error(`Error during bot initialization: ${error.stack}`, ["Bot","Error"]);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  bot.logger.warn("Process terminated. Cleaning up...", ["Bot", "Shutdown"]);
  await bot.destroy();
  await mongoose.connection.close();
  process.exit(0);
});
