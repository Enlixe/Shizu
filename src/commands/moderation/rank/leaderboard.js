const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const UserDB = require("../../../structures/schemas/user");

const AsciiTable = require("ascii-table");
const table = new AsciiTable().setHeading("#", "User", "Level", "XP");

module.exports = {
  subCommand: "rank.leaderboard",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { guild } = interaction;

    const users = await UserDB.find({ Guild: guild.id })
      .sort({ level: -1 })
      .limit(10);

    const startIndex = 0;

    if (users.length) {
      users.forEach((user, position) => {
        const member = interaction.guild.members.cache.get(user.User);
        table.addRow(
          startIndex + position + 1,
          member ? member.user.username : "Unknown User",
          user.level,
          user.xp
        );
      });

      const embed = new EmbedBuilder()
        .setTitle(`📊 Leaderboard from: ${guild.name}`)
        .setColor("Random")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription("```" + table.toString() + "```")
        .setColor(bot.config.color.default)
        .setFooter({
          text: `Requested by ${interaction.user.tag} - ${bot.config.embed.footer}`,
        });

      interaction.reply({ embeds: [embed] });
    }
  },
};
