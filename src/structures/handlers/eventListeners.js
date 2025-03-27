module.exports = (bot) => {
    bot.on("disconnect", () => bot.logger.warn("Bot is disconnecting...", ["Bot"]))
      .on("reconnecting", () => bot.logger.warn("Bot reconnecting...", ["Bot"]))
      .on("error", (e) => bot.logger.error(e, ["Bot", "Error"]))
      .on("warn", (info) => bot.logger.warn(info, ["Bot", "Warn"]));
  };