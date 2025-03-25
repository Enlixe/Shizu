const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Rank = require("../../structures/schemas/rank");
const Welcomer = require("../../structures/schemas/welcomer");

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
          { name: "welcomer", value: "welcomer" },
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
      case "welcomer":
        let _welcomer = await Welcomer.findOne({ Guild: interaction.guild.id });
        if (_welcomer) {
        let gConfig = bot.guildConfig.get(interaction.guildId);
          gConfig.enabled = !gConfig.enabled;
          _welcomer.enabled = !_welcomer.enabled;
          await _welcomer.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(
                  _welcomer.enabled
                    ? bot.config.color.green
                    : bot.config.color.red
                )
                .setDescription(
                  `Welcomer system has been \`${
                    _welcomer.enabled ? "enabled" : "disabled"
                  }\`.`
                ),
            ],
          });
        } else {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(bot.config.color.default)
                .setFooter({ text: bot.config.embed.footer })
                .setTimestamp()
                .setDescription(
                  `**Welcomer module is not enabled.\nPlease enable first at </welcomer:1352835206331236448>**`
                ), // Please enable first at 1352835206331236448
            ],
          });
        }
        break;
    }
  },
};
