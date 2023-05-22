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

const { loadEvents } = require("./structures/handlers/eventHandler");

bot.config = require("./config.js");

const Logger = require("./structures/functions/logger");
bot.logger = new Logger(); // client.logger.log('Client is Running!', ['CLIENT']);

bot.events = new Collection();
bot.commands = new Collection();
bot.subCommands = new Collection();

const { connect } = require("mongoose");
connect(bot.config.database, {}).then(() =>
  bot.logger.log(`Database connected.`, ["CLIENT"])
);

loadEvents(bot);

bot.login(bot.config.token);
