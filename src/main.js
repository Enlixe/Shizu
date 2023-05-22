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

loadEvents(bot);

bot.login(bot.config.token);
