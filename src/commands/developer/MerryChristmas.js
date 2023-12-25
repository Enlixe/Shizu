const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
module.exports = {
    folder: "special",
    data: new SlashCommandBuilder()
        .setName("MerryChristmas")
        .setDescription("Merry Christmas! for all you guys. Wishing you joy, love, and peace."),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        return interaction.reply({ content: "Merry Christmas! for all you guys. Wishing you joy, love, and peace." });
    },
};
  