const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  folder: "information",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping, pong, ping..."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    return interaction.reply({ content: "Pong.", ephemeral: true });
  },
};
