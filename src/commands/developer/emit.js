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
  execute(interaction, bot) {
    const events = interaction.options.getString("events");
    bot.emit(events, interaction.member);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(bot.config.color.default)
          .setDescription(`Emitted ${events}`),
      ],
      ephemeral: true,
    });
  },
};
