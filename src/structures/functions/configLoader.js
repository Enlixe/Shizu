// const { Collection } = require("discord.js");
// const memberLog = require("../schemas/memberLog");
// const welcomer = require("../schemas/welcomer");

// async function loadConfig(bot) {
//   try {
//     const memberLogC = await loadMemberLogConfig();
//     const welcomeC = await loadWelcomerConfig();

//     bot.guildConfig = mergeCollections(welcomeC, memberLogC);

//     bot.logger.log("Loaded Guild Configs to the Collection.", ["Bot", "DB"]);
//   } catch (error) {
//     bot.logger.error("Failed to load guild configs.", ["Bot", "DB", error]);
//     throw error; // Re-throw the error if needed
//   }
// }

// async function loadMemberLogConfig() {
//   const collection = new Collection();
//   const docs = await memberLog.find();
//   docs.forEach((doc) => {
//     collection.set(doc.Guild, {
//       logChannel: doc.logChannel,
//       roleMember: doc.roleMember,
//       roleBot: doc.roleBot,
//     });
//   });
//   return collection;
// }

// async function loadWelcomerConfig() {
//   const collection = new Collection();
//   const docs = await welcomer.find();
//   docs.forEach((doc) => {
//     collection.set(doc.Guild, {
//       enabled: doc.enabled,
//       welcomeChannel: doc.welcomeChannel,
//       welcomeMsg: doc.welcomeMsg,
//       welcomeAttachment: doc.welcomeAttchment,
//     });
//   });
//   return collection;
// }

// async function addConfig(bot, id, config) {
//   try {
//     const newConfig = new Collection([[id, { ...config }]]);
//     bot.guildConfig = mergeCollections(bot.guildConfig, newConfig);
//     return true;
//   } catch (error) {
//     bot.logger.error("Failed to add config.", ["Bot", "DB", error]);
//     throw error;
//   }
// }

// function mergeCollections(...collections) {
//   const mergedCollection = new Collection();

//   for (const collection of collections) {
//     if (!(collection instanceof Collection)) {
//       throw new TypeError("All inputs must be instances of Collection.");
//     }

//     for (const [key, value] of collection) {
//       if (mergedCollection.has(key)) {
//         // Merge existing value with the new value
//         const mergedValue = { ...mergedCollection.get(key), ...value };
//         mergedCollection.set(key, mergedValue);
//       } else {
//         // Add new key-value pair
//         mergedCollection.set(key, value);
//       }
//     }
//   }

//   return mergedCollection;
// }

// module.exports = { loadConfig, addConfig };