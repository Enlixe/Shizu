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
  name: "warn",
  description: "Warn a member.",

  default_member_permissions: PermissionFlagsBits.ModerateMembers,
  dm_permission: false,

  options: [
    {
      name: "target",
      description: "Select the target member.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Provide a reason for this warning.",
      type: ApplicationCommandOptionType.String,
      max_length: 512,
    },
  ],
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { options, guild, member } = interaction;

    const target = options.getMember("target");
    const reason = options.getString("reason") || "None specified.";

    const errorsArray = [];
    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not warn member due to" })
      .setColor(bot.config.color.red);

    if (!target)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription("Member has most likely left the guild."),
        ],
        ephermeral: true,
      });

    // if (!target.manageable || !target.moderatable)
    //   errorsArray.push("Selected target is not moderatable by this bot.");

    if (member.roles.highest.postion < target.roles.highest.postion)
      errorsArray.push("Selected member has a higher postion than you.");

    if (errorsArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
        ephermeral: true,
      });

    const newInfractionsObject = {
      Type: "Warning",
      IssuerID: member.id,
      IssuerName: member.user.username,
      Reason: reason,
      Date: Date.now(),
    };

    let userData = await DB.findOne({ Guild: guild.id, User: target.id });
    if (!userData)
      userData = await DB.create({
        Guild: guild.id,
        User: target.id,
        Infractions: [newInfractionsObject],
      });
    else
      userData.Infractions.push(newInfractionsObject) &&
        (await userData.save());

    const successEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Warning Issued`,
        iconURL: guild.iconURL(),
      })
      .setColor(bot.config.color.default)
      .setDescription(
        [
          `Warned User: ${target}`,
          `Issuer: ${member}`,
          `Total Infraction Points: **${userData.Infractions.length}**`,
          `\nReason: ${reason}`,
        ].join("\n")
      )
      .setFooter({ text: bot.config.embed.footer });

    const dmEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Warning Issued`,
        iconURL: guild.iconURL(),
      })
      .setColor(bot.config.color.default)
      .setDescription(
        [
          `You have been **Warned** in ${interaction.guild.name}`,
          `Issuer: ${member}`,
          `Total Infraction Points: **${userData.Infractions.length}**`,
          `\nReason: ${reason}`,
        ].join("\n")
      )
      .setFooter({ text: bot.config.embed.footer });

    target.send({
      embeds: [dmEmbed],
      components: [bot.config.fromServer(guild.name)],
    });
    return interaction.reply({ embeds: [successEmbed] });
  },
};
