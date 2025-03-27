const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  subCommand: "test.buttons",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, bot) {
    const target = interaction.user;

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle("Test Button")
          .setDescription("Test the button handler.")
          .setColor(bot.config.color.default),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`test:${target.id}`) // Note the buttons ID is on the left of the _ and the id is on the right. Also note your CANNOT have another _ in the customid eg `my_coolbutton_${target.id}`
            .setLabel("Test Button")
            .setEmoji("🌸")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
      ephemeral: true,
    });
  },
};
