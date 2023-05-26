const { Collection } = require("discord.js");
const memberLog = require("../schemas/memberLog");
const welcomer = require("../schemas/welcomer");

async function loadConfig(bot) {
  let memberLogC = new Collection();
  (await memberLog.find()).forEach((doc) => {
    memberLogC.set(doc.Guild, {
      logChannel: doc.logChannel,
      roleMember: doc.roleMember,
      roleBot: doc.roleBot,
    });
  });

  let welcomeC = new Collection();
  (await welcomer.find()).forEach((doc) => {
    welcomeC.set(doc.Guild, {
      welcomeChannel: doc.welcomeChannel,
      welcomeMsg: doc.welcomeMsg,
      welcomeAttachment: doc.welcomeAttchment,
    });
  });

  bot.guildConfig = await mergeCollections(welcomeC, memberLogC);
  console.log(bot.guildConfig);

  return bot.logger.log("Loaded Guild Configs to the Collection.", ["CLIENT"]);
}

async function addConfig(bot, id, config) {
  const { ...rest } = config;
  const newConfig = new Collection([[id, rest]]);
  bot.guildConfig = await mergeCollections(bot.guildConfig, newConfig);
  return true;
}

function mergeCollections(...collections) {
  const mergedCollection = new Collection();

  for (const collection of collections) {
    for (const [key, value] of collection) {
      if (mergedCollection.has(key)) {
        // If the key already exists in the merged collection,
        // we merge the value object with the existing value.
        const mergedValue = Object.assign({}, mergedCollection.get(key), value);
        mergedCollection.set(key, mergedValue);
      } else {
        // If the key doesn't exist in the merged collection,
        // we set the value as is.
        mergedCollection.set(key, value);
      }
    }
  }

  return mergedCollection;
}

module.exports = { loadConfig, addConfig };
