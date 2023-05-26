const { EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  id: "test",

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, bot, args) {
    const target = args[0];
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Test button response")
          .setDescription(`Test, args, <@${target}>`)
          .setColor(bot.config.color.default),
      ],
      ephemeral: true,
    });
  },
};
