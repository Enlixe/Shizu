const { ChatInputCommandInteraction, InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, bot) {
    console.log(`[DEBUG] Interaction started at: ${Date.now()}`);

    const cmd = bot.commands.get(interaction.commandName);
    if (interaction.isChatInputCommand()) {
      if (!cmd)
        return interaction.reply({
          content: "This command is outdated.",
          flags: 64,
        });

      if (cmd.developer && !bot.config.developers.includes(interaction.user.id))
        return interaction.reply({
          content: "This command is only available to the developer.",
          flags: 64,
        });

      const subCommand = interaction.options.getSubcommand(false);
      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply({ flags: 64 }); // Use flags instead of ephemeral
        }

        if (subCommand) {
          const scFile = bot.subCommands.get(
            `${interaction.commandName}.${subCommand}`
          );
          if (!scFile) {
            await cmd.execute(interaction, bot);
          } else {
            await scFile.execute(interaction, bot);
          }
        } else await cmd.execute(interaction, bot);
      } catch (err) {
        if (!interaction.replied && interaction.deferred) {
          await interaction.followUp({
            content:
              "There's something wrong, please report this to the bot developer.",
            flags: 64,
          });
        }
        bot.logger.error(
          `Error in command ${interaction.commandName}: ${err.message}`,
          ["Event", "Slash"]
        );
      }
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      if (cmd && typeof cmd.autocomplete === "function") {
        cmd.autocomplete(interaction, bot);
      } else {
        console.warn(
          `[WARN] Autocomplete called for ${interaction.commandName}, but no handler found.`
        );
      }
    }
  },
};
