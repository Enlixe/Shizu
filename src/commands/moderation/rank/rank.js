const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Configure the ranking system or check your rank.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("me")
        .setDescription("Check your rank or another user.")
        .addUserOption((option) =>
          option.setName("user").setDescription("The user you want to check.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leaderboard")
        .setDescription("Check the leaderboard Guild.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("log")
        .setDescription("Set the channel to log to.")
        .addBooleanOption((op) =>
          op
            .setName("enabled")
            .setDescription("Do you want the log be enabled ?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("option")
            .setDescription(
              "What do you want to enable / disable, the channel notification or logging ?"
            )
            .addChoices(
              { name: "log", value: "log" },
              { name: "notification", value: "notification" }
            )
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel where the log will be sent.")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("role")
        .setDescription("Add role rewards to user when reached specific level.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("role_add")
            .setDescription(
              "Add role rewards to user when reached specific level."
            )
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
            .setName("role_remove")
            .setDescription(
              "Remove role rewards to user when reached specific level."
            )
            .addIntegerOption((option) =>
              option
                .setName("level")
                .setDescription("Specificy the level needed to get the role.")
                .setMinValue(1)
                .setRequired(true)
            )
        )
    ),
};
