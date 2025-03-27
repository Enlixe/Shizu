import { Config } from "./ShizuClient";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, resolveColor, ColorResolvable } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.TOKEN || !process.env.MONGO_URI) {
  throw new Error("Missing required environment variables: TOKEN or MONGO_URI");
}

const config: Config = {
  token: process.env.TOKEN,
  database: process.env.MONGO_URI,
  debug: true,
  table: true,
  developers: ["524805915526955048"], // Your ID

  color: {
    default: resolveColor("#7b00ff"),
    red: resolveColor("#ff0051"),
    green: resolveColor("#00fcb9"),
  },
  embed: {
    footer: "Shizu | シズ", // And the default footer for the embeds
  },

  defaultEmbed, // Explicitly assign the function
  xpFormula,
  fromServer,
};

/**
 * Creates a default embed with pre-configured settings.
 * @param {string} description - The description of the embed.
 * @param {string} [title] - The optional title of the embed.
 * @returns {Promise<EmbedBuilder>} - The configured embed.
 */
async function defaultEmbed(description: string, title?: string): Promise<EmbedBuilder> {
  const embed = new EmbedBuilder()
    .setColor(config.color.default)
    .setDescription(description);
  if (title) {
    embed.setTitle(title);
  }
  return embed;
}

/**
 * XP Formula
 * @param {number} level
 * @returns {number} - The calculated XP
 */
function xpFormula(level: number): number {
  const base = 4 + Math.min(level / 10, 1);
  const power = Math.pow(base * level, 2.8);
  const xp = Math.floor(power / 8);
  return xp;
}

/**
 * From Server
 * @param {string} server
 * @returns {ActionRowBuilder} - The action row with the button
 */
function fromServer(server: string): ActionRowBuilder {
  if (!server || typeof server !== "string") {
    throw new Error("Invalid server name provided to fromServer");
  }

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("server")
      .setLabel("Sent from server: " + server)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}

export default config;