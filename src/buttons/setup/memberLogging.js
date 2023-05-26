const {
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  id: "memberlogging", // The buttons .setCustomId

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, bot, args) {
    const member = (await interaction.guild.members.fetch()).get(args[1]);
    const Embed = new EmbedBuilder().setColor(bot.config.color.red);
    const errorArray = [];

    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers))
      errorArray.push(
        "You do not have the required permissions for this action."
      );
    if (!member)
      errorArray.push("This user is no longer a member of this guild.");
    if (!member.moderatable)
      errorArray.push(`${member} is not moderatable by this bot.`);
    if (errorArray.length)
      return interaction.reply({
        embeds: [Embed.setDescription(errorArray.join("\n"))],
        ephemeral: true,
      });

    switch (args[0]) {
      case "kick":
        member
          .kick(`Kicked by: ${interaction.user.tag} | Member Logging System `)
          .then(() => {
            interaction.reply({
              embeds: [Embed.setDescription(`${member} has been kicked.`)],
            });
          })
          .catch(() => {
            interaction.reply({
              embeds: [Embed.setDescription(`${member} couldn't be kicked`)],
            });
          });
        break;
      case "ban":
        member
          .ban(`Banned by: ${interaction.user.tag} | Member Logging System `)
          .then(() => {
            interaction.reply({
              embeds: [Embed.setDescription(`${member} has been banned.`)],
            });
          })
          .catch(() => {
            interaction.reply({
              embeds: [Embed.setDescription(`${member} couldn't be banned`)],
            });
          });
        break;
    }
  },
};
