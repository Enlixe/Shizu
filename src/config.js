const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();

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
  fromServer,
};

/**
 * @param {EmbedBuilder} embed
 */
function fromServer(server) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("server")
      .setLabel("Sent from server: " + server)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}
