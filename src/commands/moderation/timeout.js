const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");
const DB = require("../../structures/schemas/infractions");
const ms = require("ms");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Restrict a member's ability to communicate.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((op) =>
      op
        .setName("target")
        .setDescription("Select the target member.")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("duration")
        .setDescription("Provide a duration for this timeout (1m, 2h, 7d).")
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("reason")
        .setDescription("Provide a reason for this timeout.")
        .setMaxLength(512)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { options, guild, member } = interaction;

    const target = options.getMember("target");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "None specified.";

    const errorsArray = [];

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Couldn't timeout member due to" })
      .setColor(bot.config.color.red);

    if (!target)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription("Member has most likely left the guild."),
        ],
        ephemeral: true,
      });

    if (!ms(duration) || ms(duration) > ms("28d"))
      errorsArray.push("Time provided is invalid or over the 28 days limit.");

    if (!target.manageable || !target.moderatable)
      errorsArray.push("Selected member is not moderatable by this bot.");

    if (member.roles.highest.position < target.roles.highest.position)
      errorsArray.push("Selected member has a higher roles position than you.");

    if (errorsArray.length)
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
        ephemeral: true,
      });

    target.timeout(ms(duration), reason).catch((err) => {
      interaction.reply({
        embeds: [
          errorsEmbed.setDescription(
            "Couldn't timeout member due to an uncommon error.\nPlease try again!"
          ),
        ],
      });

      return bot.logger.log("Error occured in timeout.js", ["COMMANDS", err]);
    });

    const infractions = {
      Type: "Timeout",
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
        Infractions: [infractions],
      });
    else userData.Infractions.push(infractions) && (await userData.save());

    const successEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Timeout Issued",
        iconURL: guild.iconURL(),
      })
      .setColor(bot.config.color.default)
      .setDescription(
        [
          `${target} was issued a timeout for **${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
          `bringing their infractions total to **${userData.Infractions.length}** points`,
          `\nReason: ${reason}`,
        ].join("\n")
      )
      .setFooter({ text: bot.config.embed.footer });

    return interaction.reply({ embeds: [successEmbed] });
  },
};
