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

const { connect } = require("mongoose");
const Logger = require("./structures/functions/logger");
const { loadEvents } = require("./structures/handlers/eventHandler");
const { loadConfig } = require("./structures/functions/configLoader");

bot.config = require("./config.js");
bot.logger = new Logger(); // client.logger.log('Client is Running!', ['CLIENT']);

bot.events = new Collection();
bot.commands = new Collection();
bot.subCommands = new Collection();

bot.guildConfig = new Collection();

connect(bot.config.database, {}).then(() =>
  bot.logger.log(`Database connected.`, ["CLIENT"])
);

loadEvents(bot);
loadConfig(bot);

bot.login(bot.config.token);
