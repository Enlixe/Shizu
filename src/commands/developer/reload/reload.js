const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload the bot commands / events.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((op) =>
      op.setName("events").setDescription("Reload the bot events.")
    )
    .addSubcommand((op) =>
      op.setName("commands").setDescription("Reload the bot commands")
    ),
};
