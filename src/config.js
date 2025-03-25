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

  xpFormula,

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

function xpFormula(level) {
  let xp = Math.floor(Math.pow((4 + Math.min(level / 10, 1)) * level, 2.8) / 8);
  return xp;
}

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
