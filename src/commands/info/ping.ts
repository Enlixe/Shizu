import { ChatInputCommandInteraction } from "discord.js";
import { ShizuClient, Command } from "../../ShizuClient"; // Adjust the import path as necessary

const pingCommand: Command = {
  folder: "info",
  name: "ping",
  description: "Ping, pong, ping...",
  async execute(interaction: ChatInputCommandInteraction, bot: ShizuClient): Promise<void> {
    const embed = await bot.config.defaultEmbed(`🏓 Pong! Latency is **${bot.ws.ping}ms**.`);
    interaction.followUp({ embeds: [embed], flags: 64 });
    return;
  },
};

export = pingCommand;