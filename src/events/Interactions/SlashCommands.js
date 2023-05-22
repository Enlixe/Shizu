const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, bot) {
    if (!interaction.isChatInputCommand()) return;

    const cmd = bot.commands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        content: "This command is outdated.",
        ephemeral: true,
      });

    if (cmd.developer && interaction.user.id.indexOf(bot.config.developers))
      return interaction.reply({
        content: "This command is only available to the developer.",
        ephemeral: true,
      });

    cmd.execute(interaction, bot);
  },
};
