import { ChatInputCommandInteraction, InteractionType } from "discord.js";
import { ShizuClient, Event } from "../../ShizuClient"; // Adjust the import path as necessary

const interactionCreateEvent: Event = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {ShizuClient} bot
   */
  async execute(interaction: ChatInputCommandInteraction, bot: ShizuClient): Promise<void> {
    bot.logger.debug(`Interaction started at: ${new Date().toLocaleString()}`, ["Event", "Slash"]);

    const cmd = bot.commands.get(interaction.commandName);    if (interaction.isChatInputCommand()) {
      if (!cmd) {
        await interaction.reply({
          content: "This command is outdated.",
          flags: 64,
        });
        return;
      }

      if (cmd.developer && !bot.config.developers.includes(interaction.user.id)) {
        await interaction.reply({
          content: "This command is only available to the developer.",
          flags: 64,
        });
        return;
      }

      const subCommand = interaction.options.getSubcommand(false);
      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply({ flags: 64 }); // Use flags instead of ephemeral
        }

        if (subCommand) {
          const scFile = bot.subCommands.get(`${interaction.commandName}.${subCommand}`);
          if (!scFile) {
            await cmd.execute(interaction, bot);
          } else {
            await scFile.execute(interaction, bot);
          }
        } else {
          await cmd.execute(interaction, bot);
        }
      } catch (err: Error | any) {
        if (!interaction.replied && interaction.deferred) {
          await interaction.followUp({
            content: "There's something wrong, please report this to the bot developer.",
            flags: 64,
          });
        }
        bot.logger.error(
          `Error in command ${interaction.commandName}: ${err.message}`,
          ["Event", "Slash"]
        );
      }
    }

    // if (interaction.isAutocomplete()) {
    //   if (cmd && typeof cmd.autocomplete === "function") {
    //     await cmd.autocomplete(interaction, bot);
    //   } else {
    //     console.warn(
    //       `[WARN] Autocomplete called for ${interaction.commandName}, but no handler found.`
    //     );
    //   }
    // }
}};

export = interactionCreateEvent;