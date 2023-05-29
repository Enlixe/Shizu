const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  folder: "developer",
  developer: true,
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test the bot's handler.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((op) =>
      op.setName("buttons").setDescription("Test the bot's button handler.")
    ),
};
