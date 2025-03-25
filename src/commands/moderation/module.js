const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");
const Rank = require("../../structures/schemas/rank");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("module")
    .setDescription("Enable/disable specific module.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("The module you want to enable/disable.")
        .setRequired(true)
        .addChoices([
          { name: "rank", value: "rank" },
          { name: "Moderation", value: "moderation" },
        ])
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    switch (interaction.options.getString("module")) {
      case "rank":
        let _rank = await Rank.findOne({ Guild: interaction.guild.id });
        let status = false;
        if (_rank) {
          _rank.enabled = !_rank.enabled;
          await _rank.save();
          status = _rank.enabled;
        } else {
          let newRank = new Rank({
            Guild: interaction.guild.id,
            enabled: true,
          });
          await newRank.save();
          status = true;
        }
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(status ? bot.config.color.green : bot.config.color.red)
              .setDescription(
                `Ranking system has been \`${
                  status ? "enabled" : "disabled"
                }\`.`
              ),
          ],
        });
      case "moderation":
        // Enable/disable moderation module
        break;
    }
  },
};
