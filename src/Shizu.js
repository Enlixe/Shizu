const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const bot = new Client({
  intents: [ Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent ],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { connect } = require("mongoose");
const Logger = require("./structures/functions/logger"),
  { loadConfig } = require("./structures/functions/configLoader"),
  { loadEvents } = require("./structures/handlers/eventHandler"),
  { loadButtons } = require("./structures/handlers/buttonHandler"),
  { loadCommands } = require("./structures/handlers/commandHandler");

bot.events = new Collection();
bot.commands = new Collection();
bot.subCommands = new Collection();
bot.buttons = new Collection();

bot.guildConfig = new Collection();

bot.logger = new Logger(); // client.logger.log('Client is Running!', ['CLIENT']);
bot.config = require("./config.js");

bot.login(bot.config.token).then(async () => {
  loadEvents(bot);
  loadButtons(bot);

  await connect(bot.config.database)
    .then(() =>
      bot.logger.log(`Connected to the Mongodb database.`, ["CLIENT","DATABASE"])
    )
    .catch((err) => {
      bot.logger.error(
        "Unable to connect to the Mongodb database. Error: " + err,
        ["CLIENT", "DATABASE"]
      );
    });

  await loadConfig(bot);
  await loadCommands(bot);
});

bot
  .on("disconnect", () => bot.logger.warn("Bot is disconnecting...", ["CLIENT"]))
  .on("reconnecting", () => bot.logger.warn("Bot reconnecting...", ["CLIENT"]))
  .on("error", (e) => bot.logger.error(e, ["CLIENT", "ERROR"]))
  .on("warn", (info) => bot.logger.warn(info, ["CLIENT", "WARN"]));
