const {
  ButtonInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const splitArray = interaction.customId.split(":");
    if (!splitArray[0] === "memberlogging") return;

    const member = (await interaction.guild.members.fetch()).get(splitArray[2]);
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

    switch (splitArray[1]) {
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
