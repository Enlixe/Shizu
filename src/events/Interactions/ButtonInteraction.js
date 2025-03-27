module.exports = {
  name: "interactionCreate",

  async execute(interaction, bot) {
    if (!interaction.isButton()) return;

    const [mainId, subId, ...args] = interaction.customId.split(":");

    // Attempt to retrieve the button handler
    const buttonHandler =
      bot.buttons.get(`${mainId}:${subId}`) || bot.buttons.get(mainId);

    if (!buttonHandler) return;

    try {
      // Execute the button handler with appropriate arguments
      const handlerIdParts = buttonHandler.id.split(":");
      const handlerArgs = handlerIdParts[1] ? args : subId ? [subId, ...args] : [];
      await buttonHandler.execute(interaction, bot, handlerArgs);
    } catch (error) {
      console.error(`Error executing button interaction: ${error.message}`);
    }
  },
};