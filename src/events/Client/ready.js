const { Client } = require("discord.js");
const { connect } = require("mongoose");
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

    connect(bot.config.database)
      .then(() =>
        bot.logger.log(`Connected to the Mongodb database.`, ["CLIENT"])
      )
      .catch((err) => {
        bot.logger.log(
          "Unable to connect to the Mongodb database. Error:" + err,
          ["CLIENT"]
        );
      });

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
