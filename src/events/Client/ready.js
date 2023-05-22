const { Client } = require("discord.js");
const { loadCommands } = require("../../structures/handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} bot
   */
  execute(bot) {
    bot.logger.log("Client is Running!", ["CLIENT"]);
    bot.user.setActivity(`with ${bot.guilds.cache.size} guilds`);

    loadCommands(bot);
  },
};
