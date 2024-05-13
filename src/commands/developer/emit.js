const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  folder: "developer",
  developer: true,
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit bot events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption((op) =>
      op
        .setName("events")
        .setDescription("Specify the events that will be emitted.")
        .addChoices(
          { name: "guildMemberAdd", value: "guildMemberAdd" },
          { name: "guildMemberRemove", value: "guildMemberRemove" }
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const events = interaction.options.getString("events");
    await interaction.deferReply({ ephemeral: true })
    bot.emit(events, interaction.member);
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(bot.config.color.default)
          .setDescription(`Emitted ${events}`),
      ],
      ephemeral: true,
    });
  },
};
