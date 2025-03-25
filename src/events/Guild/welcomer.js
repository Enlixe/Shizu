const { GuildMember, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} bot
   */
  async execute(member, bot) {
    const guildConfig = bot.guildConfig.get(member.guild.id);
    if (!guildConfig) return;
    if (!guildConfig.enabled) return;
    if (!guildConfig.welcomeChannel) return;
    
    let msg = guildConfig.welcomeMsg;
    let attachment = guildConfig.welcomeAttachment;

    const { user, guild } = member;

    msg
      ? null
      : (msg = `Welcome ${user} to ${guild.name}.\nWe hope you enjoy your stay here!`);

    let Embed = new EmbedBuilder()
      .setAuthor({ name: `${user.username}`, iconURL: user.avatarURL() })
      .setDescription(msg)
      .setColor(bot.config.color.default)
      .setFooter({
        text: `${guild.name}`,
        iconURL: guild.iconURL(),
      })
      .setTimestamp();

    attachment ? Embed.setImage(attachment) : null;

    bot.channels.cache
      .get(channel)
      .send({ content: `${user}`, embeds: [Embed] })
      .catch((err) => {
        console.log(err);
      });
  },
};
