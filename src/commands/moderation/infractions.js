const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const DB = require("../../structures/schemas/infraction");

module.exports = {
  folder: "moderation",
  name: "infractions",
  description: "Will show the infractions of any member.",

  dm_permission: false,

  options: [
    {
      name: "target",
      description: "Select the member you would like to check.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { options, guild, member } = interaction;

    const target = options.getMember("target");

    let Infractions = new EmbedBuilder()
      .setAuthor({
        name: `Infractions`,
        iconURL: guild.iconURL(),
      })
      .setColor(bot.config.color.default)

      .setFooter({
        text: bot.config.embed.footer,
      });

    let userData = await DB.findOne({
      Guild: guild.id,
      User: target.id,
    });

    if (userData) {
      Infractions.setDescription(
        [
          `Member: ${target}`,
          `Total Infraction Points: **${userData.Infractions.length}**`,
        ].join("\n")
      );
      return interaction.reply({ embeds: [Infractions] });
    } else
      interaction.reply({
        embeds: [
          Infractions.setDescription(
            [`Member: ${target}`, `Total Infraction Points: **0**`].join("\n")
          ),
        ],
      });
  },
};
