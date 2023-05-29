const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
} = require("discord.js");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bulk delete messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption((op) =>
      op
        .setName("amount")
        .setDescription("Provide the amount of messages you intend to delete.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption((op) =>
      op
        .setName("reason")
        .setDescription(
          "Provide the reason why you are clearing these messages."
        )
    )
    .addUserOption((op) =>
      op
        .setName("target")
        .setDescription(
          "Provide the target member to only delete their messages."
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const { options, guild } = interaction;

    const amount = options.getNumber("amount");
    const reason = options.getString("reason");
    const target = options.getUser("target");

    const channelMessages = await interaction.channel.messages.fetch();
    const logChannel = guild.channels.cache.get("975294096895803402");

    const Embed = new EmbedBuilder().setColor(bot.config.color.default);
    const logEmbed = new EmbedBuilder()
      .setColor(bot.config.color.default)
      .setAuthor({ name: "Clear" })
      .setFooter({ text: bot.config.embed.footer });

    let logEmbedDesc = [
      `- Moderator: ${interaction.member}`,
      `- Channel ${interaction.channel}`,
    ];

    target ? logEmbedDesc.push(`- Target: ${target}`) : null;
    reason ? logEmbedDesc.push(`- Reason: ${reason}`) : null;

    if (target) {
      let i = 0;
      let messagesToDelete = [];
      channelMessages.filter((message) => {
        if (message.author.id === target.id && amount > i) {
          messagesToDelete.push(message);
          i++;
        }
      });

      interaction.channel.bulkDelete(messagesToDelete, true).then((msg) => {
        interaction.reply({
          embeds: [
            Embed.setDescription(
              `🧹 Cleared \`${msg.size}\` messages from ${target}.`
            ),
          ],
          ephemeral: true,
        });

        logEmbedDesc.push(`- Total Messages: ${msg.size}`);
        logChannel.send({
          embeds: [logEmbed.setDescription(logEmbedDesc.join("\n"))],
        });
      });
    } else {
      interaction.channel.bulkDelete(amount, true).then((msg) => {
        interaction.reply({
          embeds: [
            Embed.setDescription(`🧹 Cleared \`${msg.size}\` messages.`),
          ],
          ephemeral: true,
        });

        logEmbedDesc.push(`- Total Messages: ${msg.size}`);
        logChannel.send({
          embeds: [logEmbed.setDescription(logEmbedDesc.join("\n"))],
        });
      });
    }
  },
};
