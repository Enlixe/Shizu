const { ChatInputCommandInteraction, Client } = require("discord.js");
const { loadEvents } = require("../../../structures/handlers/eventHandler");

module.exports = {
  subCommand: "reload.events",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    for (const [key, value] of bot.events)
      bot.removeListener(`${key}`, value, true);
    await loadEvents(bot);
    return interaction.reply({ content: "Reloaded Events.", ephemeral: true });
  },
};
