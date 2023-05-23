const configDB = require("../schemas/memberLog");

async function loadConfig(bot) {
  (await configDB.find()).forEach((doc) => {
    bot.guildConfig.set(doc.Guild, {
      logChannel: doc.logChannel,
      roleMember: doc.roleMember,
      roleBot: doc.roleBot,
    });
  });

  return bot.logger.log("Loaded Guild Configs to the Collection.", ["CLIENT"]);
}

module.exports = { loadConfig };
