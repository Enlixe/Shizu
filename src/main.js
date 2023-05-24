const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const bot = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { connect } = require("mongoose"),
  chalk = require("chalk");

const Logger = require("./structures/functions/logger"),
  { loadEvents } = require("./structures/handlers/eventHandler"),
  { loadConfig } = require("./structures/functions/configLoader");

bot.config = require("./config.js");

bot.logger = new Logger(); // client.logger.log('Client is Running!', ['CLIENT']);

bot.events = new Collection();
bot.commands = new Collection();
bot.subCommands = new Collection();

bot.guildConfig = new Collection();

connect(bot.config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => bot.logger.log(`Connected to the Mongodb database.`, ["CLIENT"]))
  .catch((err) => {
    bot.logger.log("Unable to connect to the Mongodb database. Error:" + err, [
      "CLIENT",
    ]);
  });

loadEvents(bot);
loadConfig(bot);

bot.login(bot.config.token);

bot
  .on("disconnect", () => bot.logger.log("Bot is disconnecting...", ["WARN"]))
  .on("reconnecting", () => bot.logger.log("Bot reconnecting...", ["CLIENT"]))
  .on("error", (e) => bot.logger.log(e, ["ERROR"]))
  .on("warn", (info) => bot.logger.log(info, ["WARN"]));

process.on("unhandledRejection", (err) => {
  console.error(err);
});
