const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  folder: "information",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping, pong, ping..."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
      const embed = await bot.config.defaultEmbed(`🏓 Pong! Latency is **${bot.ws.ping}ms**.`);
      return await interaction.followUp({ embeds: [embed] });
  },
};