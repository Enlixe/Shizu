const { GuildMember, Client, EmbedBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   * @param {Client} bot
   */
  async execute(member, bot) {
    const guildConfig = bot.guildConfig.get(member.guild.id);
    if (!guildConfig) return;

    const logChannel = (await member.guild.channels.fetch()).get(
      guildConfig.logChannel
    );
    if (!logChannel) return;

    const accountCreation = parseInt(member.user.createdTimestamp / 1000);

    const Embed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.tag} | ${member.id}`,
        iconURL: member.displayAvatarURL(),
      })
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setDescription(
        [
          `- User: ${member.user}`,
          `- Account Type: ${member.user.bot ? "Bot" : "User"}`,
          `- Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
        ].join("\n")
      )
      .setFooter({ text: "Left" })
      .setTimestamp();

    logChannel.send({ embeds: [Embed] });
  },
};
