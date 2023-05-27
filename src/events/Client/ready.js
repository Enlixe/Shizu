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

    bot
      .on("disconnect", () =>
        bot.logger.log("Bot is disconnecting...", ["WARN"])
      )
      .on("reconnecting", () =>
        bot.logger.log("Bot reconnecting...", ["CLIENT"])
      )
      .on("error", (e) => bot.logger.log(e, ["ERROR"]))
      .on("warn", (info) => bot.logger.log(info, ["WARN"]));
    process.on("unhandledRejection", (err) => {
      console.error(err);
    });
  },
};
