const { ChatInputCommandInteraction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, bot) {
    const cmd = bot.commands.get(interaction.commandName);
    if (interaction.isChatInputCommand()) {
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

      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
        const scFile = bot.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );
        if (!scFile) {
          try {
            cmd.execute(interaction, bot);
          } catch (err) {
            return interaction.reply({
              content: "This sub-command is outdated.",
              ephemeral: true,
            });
          }
        } else {
          scFile.execute(interaction, bot);
        }
      } else cmd.execute(interaction, bot);
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      cmd.autocomplete(interaction, bot);
    }
  },
};
