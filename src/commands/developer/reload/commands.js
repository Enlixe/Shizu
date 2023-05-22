const { ChatInputCommandInteraction, Client } = require("discord.js");
const { loadCommands } = require("../../../structures/handlers/commandHandler");

module.exports = {
  subCommand: "reload.commands",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    await loadCommands(bot);
    return interaction.reply({
      content: "Reloaded Commands.",
      ephemeral: true,
    });
  },
};
