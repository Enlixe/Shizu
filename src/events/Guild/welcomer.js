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

    const channel = guildConfig.welcomeChannel;

    const { user, guild } = member;
    bot.channels.cache
      .get(channel)
      .send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`**${user.username}** joined **${guild.name}**`)
            .setColor(bot.config.color.default)
            .setFooter({
              text: `${guild.name} now has ${guild.memberCount} members`,
              iconURL: guild.iconURL(),
            }),
        ],
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
