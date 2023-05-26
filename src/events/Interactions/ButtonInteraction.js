module.exports = {
  name: "interactionCreate",

  async execute(interaction, bot) {
    if (!interaction.isButton()) return;

    const buttonCustomId = interaction.customId.split(":");

    let Button;
    if (buttonCustomId[2])
      Button =
        bot.buttons.get(buttonCustomId[0] + ":" + buttonCustomId[1]) ||
        bot.buttons.get(buttonCustomId[0]);
    else Button = bot.buttons.get(buttonCustomId[0]);
    if (!Button) return;

    const id = Button.id.split(":");
    if (id[1]) Button.execute(interaction, bot, buttonCustomId.slice(2));
    else Button.execute(interaction, bot, buttonCustomId.slice(1));
  },
};
