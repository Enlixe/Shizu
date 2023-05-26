const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const { loadButtons } = require("../../../structures/handlers/buttonHandler");

module.exports = {
  subCommand: "reload.buttons",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    await loadButtons(bot);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(bot.config.color.default)
          .setDescription("Reloaded Component: Buttons."),
      ],
      ephemeral: true,
    });
  },
};
