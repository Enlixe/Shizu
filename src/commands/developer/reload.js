const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");
const { loadCommands } = require("../../structures/handlers/commandHandler");

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
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  execute(interaction, bot) {
    const cmd = interaction.options.getSubcommand();

    switch (cmd) {
      case "events":
        for (const [key, value] of bot.events)
          bot.removeListener(`${key}`, value, true);
        interaction.reply({ content: "Reloaded Events.", ephemeral: true });
        break;
      case "commands":
        loadCommands(bot);
        interaction.reply({ content: "Reloaded Commands.", ephemeral: true });
        break;
    }
  },
};
