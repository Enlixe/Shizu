const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
module.exports = {
    folder: "special",
    data: new SlashCommandBuilder()
        .setName("YouTube")
        .setDescription("It's my youtube channel link :D"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        return interaction.reply({ content: "https://www.youtube.com/@enlixe" });
    },
};
  