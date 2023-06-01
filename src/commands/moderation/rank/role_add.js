const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Rank = require("../../../structures/schemas/rank");

module.exports = {
  subCommand: "rank.role_add",
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

    const role = options.getRole("roles").id;
    const level = options.getInteger("level");
    const newRole = { level, role };

    let embed = new EmbedBuilder()
      .setColor(bot.config.color.default)
      .setFooter({ text: bot.config.embed.footer })
      .setTimestamp();

    let getRank = await Rank.findOne({ Guild: guild.id }, { roles: [] });
    if (!getRank) {
      let newRoleDB = new Rank({
        Guild: guild.id,
        roles: [newRole],
      });
      await newRoleDB.save();

      return interaction.reply({
        embeds: [
          embed
            .setDescription("Created level roles for this server.")
            .addFields({
              name: `Level: ${level}`,
              value: `Role: <@&${role}>`,
            }),
        ],
        ephemeral: true,
      });
    } else {
      await Rank.findOneAndUpdate(
        { Guild: guild.id },
        { $push: { roles: newRole } },
        { upsert: true, new: true }
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
            "Added new level roles for this server.\nNow the level role list are:"
          ),
        ],
        ephemeral: true,
      });
    }
  },
};
