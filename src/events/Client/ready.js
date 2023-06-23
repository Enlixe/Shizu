const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} bot
   */
  execute(bot) {
    bot.logger.log("Client is Running!", ["CLIENT"]);
    bot.user.setActivity(`with ${bot.guilds.cache.size} guilds`);
  },
};
