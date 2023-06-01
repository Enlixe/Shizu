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
const RankLog = require("../../structures/schemas/rankLog");
const AsciiTable = require("ascii-table");
const table = new AsciiTable().setHeading("#", "User", "Level", "XP");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("⚙ Configure the ranking system o Check your rank")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
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
      case "setup":
        const channel = options.getChannel("channel");

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return interaction.reply({
            content: "You don't have permissions to use this command",
            ephemeral: true,
          });

        const channelDB = await RankLog.findOne(
          { Guild: guild.id },
          {
            logChannel: channel.id,
          }
        );

        if (channelDB) {
          const error = new EmbedBuilder()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("Red")
            .addFields(
              {
                name: "🔹 The Ranking channel is already set up",
                value: `It's set up in: <#${channelDB.channel}>`,
              },
              {
                name: "🔹 If you want to change it, use:",
                value: `\`/rank delete\``,
              }
            );

          return interaction.reply({
            embeds: [error],
            ephemeral: true,
          });
        }

        const embed2 = new EmbedBuilder()
          .setColor("Random")
          .addFields(
            {
              name: "🔹 You've just set up the Ranking channel",
              value: `Moderator: <@${interaction.member.id}>`,
            },
            {
              name: "Channel",
              value: `<#${channel.id}>`,
              inline: true,
            },
            {
              name: `Made by:`,
              value: `**<@1049620709569216543>**`,
              inline: true,
            }
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed2] });

        const newChannelDB = new RankLog({
            Guild: guild.id,
            logChannel: channel.id,
          }),
          savedChannelDB = await newChannelDB.save();

        if (!savedChannelDB) {
          return interaction.reply({
            content: "An error occurred while saving the Ranking channel",
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
