const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Rank = require("../../../structures/schemas/rank");

module.exports = {
  subCommand: "rank.role_remove",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return interaction.reply({
        content: "You don't have permissions to use this command",
        ephemeral: true,
      });

    const { options, guild } = interaction;

    const level = options.getInteger("level");

    let embed = new EmbedBuilder()
      .setColor(bot.config.color.default)
      .setFooter({ text: bot.config.embed.footer })
      .setTimestamp();

    let Roles = await Rank.findOne({ Guild: guild.id });
    if (!Roles) {
      Roles = Roles.roles;
      Roles.forEach((r) => {
        embed.addFields({
          name: `Level: ${r.level}`,
          value: `Role:  <@&${r.role}>`,
        });
      });
      return interaction.reply({
        embeds: [embed.setDescription("There's no role to remove.")],
        ephemeral: true,
      });
    }

    let roleLevel;
    let roleName;
    Roles = Roles.roles;
    await Roles.forEach((r) => {
      if (r.level === level) {
        roleLevel = r.level;
        roleName = r.name;
      }
    });

    if (roleLevel === level) {
      await Rank.findOneAndUpdate(
        { Guild: guild.id },
        { $pull: { roles: { level: level, role: roleName } } },
        { safe: true, multi: true }
      );

      let Roles = await Rank.findOne({ Guild: guild.id });
      Roles = Roles.roles;
      Roles.forEach((r) => {
        embed.addFields({
          name: `Level: ${r.level}`,
          value: `Role:  <@&${r.role}>`,
        });
      });

      return interaction.reply({
        embeds: [
          embed.setDescription(
            "**Removed a role in the server level roles.**\nNow the level role list are:"
          ),
        ],
        ephemeral: true,
      });
    } else {
      let Roles = await Rank.findOne({ Guild: guild.id });
      Roles = Roles.roles;
      await Roles.forEach((r) => {
        embed.addFields({
          name: `Level: ${r.level}`,
          value: `Role:  <@&${r.role}>`,
        });
      });

      return interaction.reply({
        embeds: [
          embed.setDescription(
            `**There's no role with level \`${level}\` to remove.**`
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
