const { EmbedBuilder } = require("discord.js");

module.exports = {
  token: process.env.TOKEN,
  developers: ["524805915526955048"], // You're ID
  database: process.env.MONGO_URI,
  color: {
    default: "#7b00ff",
    red: "#ff0051",
    green: "#00fcb9",
  },
  embed: {
    footer: "Shizu | シズ", // And the default footer for the embeds
  },
};
