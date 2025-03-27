const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  folder: "info",
  name: "ping",
  description: "Ping, pong, ping...",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const embed = await bot.config.defaultEmbed(`🏓 Pong! Latency is **${bot.ws.ping}ms**.`);
    return interaction.followUp({ embeds: [embed], flags: 64 });
  },
};
