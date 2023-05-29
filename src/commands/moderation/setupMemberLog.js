const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Collection,
} = require("discord.js");
const DB = require("../../structures/schemas/memberLog");
const {
  loadConfig,
  addConfig,
} = require("../../structures/functions/configLoader");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("setup_memberlog")
    .setDescription("Configure the member logging system for this guild.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addChannelOption((op) =>
      op
        .setName("log_channel")
        .setDescription("Select the logging channel for this system.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addRoleOption((op) =>
      op
        .setName("role_member")
        .setDescription(
          "Set the role to be automatically assigned to new member."
        )
    )
    .addRoleOption((op) =>
      op
        .setName("role_bot")
        .setDescription("Set the role to be automatically assigned to new bot.")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log_channel").id;
    let rMember = options.getRole("role_member")
      ? options.getRole("role_member").id
      : null;
    let rBot = options.getRole("role_bot")
      ? options.getRole("role_bot").id
      : null;

    await DB.findOneAndUpdate(
      { Guild: guild.id },
      { logChannel: logChannel, roleMember: rMember, roleBot: rBot },
      { new: true, upsert: true }
    );

    addConfig(bot, guild.id, {
      logChannel: logChannel,
      roleMember: rMember,
      roleBot: rBot,
    });

    const Embed = new EmbedBuilder()
      .setColor(bot.config.color.green)
      .setTitle("Member Log")
      .setDescription(
        [
          `- Logging Channel: <#${logChannel}>`,
          `- Member Auto-Role: ${rMember ? `<@&${rMember}>` : "Off"}`,
          `- Bot Auto-Role: ${rBot ? `<@&${rBot}>` : "Off"}`,
        ].join("\n")
      )
      .setFooter({ text: bot.config.embed.footer });
    return interaction.reply({ embeds: [Embed] });
  },
};
