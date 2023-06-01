const {
  AttachmentBuilder,
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { Rank } = require("canvacord");
const UserDB = require("../../structures/schemas/user");
const RankLog = require("../../structures/schemas/rank");
const AsciiTable = require("ascii-table");
const table = new AsciiTable().setHeading("#", "User", "Level", "XP");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("⚙ Configure the ranking system o Check your rank")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("log")
        .setDescription("🛠 Let's start configuring the System.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "📌 The channel where the notifications will be sent."
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("role")
        .setDescription("Add role rewards to user when reached specific level.")
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("Specificy the level needed to get the role.")
            .setMinValue(1)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("roles")
            .setDescription(
              "Role to be given then the user reach specified level."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("me")
        .setDescription("📊 Check your rank o another user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("👤 The user you want to check.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leaderboard")
        .setDescription("📊 Check the leaderboard Guild.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription(
          "🗑 Delete the ranking system of the Guild. Just Channel notifications"
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { options, guild } = interaction;

    switch (options.getSubcommand()) {
      case "me":
        await interaction.deferReply();
        const member = options.getMember("user") || interaction.member;

        let user;

        const Guild = member.guild.id;
        const User = member.user.id;

        user = await UserDB.findOne({ Guild, User });

        if (!user) {
          user = {
            level: 1,
            xp: 0,
          };
        }

        let xpFormula = client.config.xpFormula(user.level);
        const rank = new Rank()
          .setAvatar(member.user.displayAvatarURL())
          .setCurrentXP(user.xp)
          .setLevel(user.level)
          .setRank(0, 0, false)
          .setRequiredXP(xpFormula)
          .setStatus(member.presence.status)
          .setProgressBar("#75ff7e", "COLOR")
          .setUsername(member.user.username)
          //   .setBackground(
          //     "IMAGE",
          //     "https://wallpapertag.com/wallpaper/full/e/c/6/477550-most-popular-hubble-ultra-deep-field-wallpaper-1920x1200.jpg" // Change to your background image just URL
          //   )
          .setDiscriminator(member.user.discriminator);

        rank.build().then((data) => {
          interaction.followUp({
            files: [new AttachmentBuilder(data, { name: "rank.png" })],
          });
        });
        break;
      case "leaderboard":
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
            .setFooter(
              { text: `Requested by ${interaction.user.tag}` },
              { iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }
            );

          interaction.reply({ embeds: [embed] });
        }
        break;
      case "log":
        const channel = options.getChannel("channel");

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            content: "You don't have permissions to use this command",
            ephemeral: true,
          });

        let embed = new EmbedBuilder()
          .setColor(client.config.color.default)
          .setFooter({ text: client.config.embed.footer })
          .setTimestamp();

        const channelDB = await RankLog.findOne(
          { Guild: guild.id },
          { logChannel: channel.id }
        );

        if (channelDB) {
          await RankLog.findOneAndReplace(
            { Guild: guild.id },
            { logChannel: channel.id }
          );

          embed.addFields(
            {
              name: "You've updated the rank log channel",
              value: `Moderator: <@${interaction.member.id}>`,
            },
            {
              name: "Channel",
              value: `<#${channel.id}>`,
            }
          );

          interaction.reply({ embeds: [embed] });
        } else {
          await RankLog.findOneAndUpdate(
            { Guild: guild.id },
            { logChannel: channel.id }
          );

          embed.addFields(
            {
              name: "You've just set up the rank log channel",
              value: `Moderator: <@${interaction.member.id}>`,
            },
            {
              name: "Channel",
              value: `<#${channel.id}>`,
            }
          );

          interaction.reply({ embeds: [embed] });
        }
        break;
      case "role":
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            content: "You don't have permissions to use this command",
            ephemeral: true,
          });
        let role = options.getRole("roles");
        role.id;
        const level = options.getInteger("level");

        let getRank = await RankLog.findOne({ Guild: guild.id }, { roles: [] });
        const newRole = { level, role };

        if (!getRank) {
          let newRoleDB = new RankLog({
            Guild: guild.id,
            roles: [newRole],
          });
          await newRoleDB.save();

          const embed = new EmbedBuilder()
            .setColor(client.config.color.default)
            .setFooter({ text: client.config.embed.footer })
            .setDescription("Created level roles for this server.")
            .addFields({
              name: `Level: ${level}`,
              value: `Role: ${role}`,
            })
            .setTimestamp();

          return interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        } else {
          await RankLog.findOneAndUpdate(
            { Guild: guild.id },
            { $push: { roles: newRole } },
            { upsert: true, new: true }
          );

          let embed = new EmbedBuilder()
            .setColor(client.config.color.default)
            .setDescription(
              "Added new level roles for this server.\nNow the level role list are:"
            )
            .setFooter({ text: client.config.embed.footer })
            .setTimestamp();

          await RankLog.findOne({ Guild: guild.id });
          let roles = Rank.roles;
          roles.forEach((r) => {
            embed.addFields({
              name: `Level: ${r.level}`,
              value: `Role: ${r.role}`,
            });
          });

          return interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }
        break;
      case "delete":
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            content: "You don't have permissions to use this command",
            ephemeral: true,
          });

        const channelDB2 = await RankLog.findOne(
          { Guild: guild.id },
          { logChannel: interaction.channel.id }
        );

        if (!channelDB2) {
          return interaction.reply({
            content: "There's no channel configured",
            ephemeral: true,
          });
        }

        const deletedChannelDB = await RankLog.findOneAndDelete({
          Guild: guild.id,
          logChannel: channelDB2.channel,
        });

        if (!deletedChannelDB) {
          return interaction.reply({
            content: "An error occurred while deleting the Ranking channel",
            ephemeral: true,
          });
        }

        interaction.reply({
          content: `The Ranking channel has been deleted`,
          ephemeral: true,
        });
        break;
    }
  },
};
