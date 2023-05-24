const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { loadCommands } = require("../../../structures/handlers/commandHandler");

module.exports = {
  subCommand: "reload.commands",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    interaction.deferReply({ ephemeral: true });
    await loadCommands(bot);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(bot.config.color.default)
          .setDescription("Reloaded Commands."),
      ],
      ephemeral: true,
    });
  },
};
