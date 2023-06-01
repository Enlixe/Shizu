const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const Rank = require("../../../structures/schemas/rank");

module.exports = {
  subCommand: "rank.log",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return interaction.reply({
        content: "You don't have permissions to use this command",
        ephemeral: true,
      });

    const { options, guild } = interaction;

    const enabled = options.getBoolean("enabled");
    const channel = options.getChannel("channel");
    const option = options.getString("option");

    let embed = new EmbedBuilder()
      .setColor(bot.config.color.default)
      .setFooter({ text: bot.config.embed.footer })
      .setTimestamp();

    const channelDB = await Rank.findOne({ Guild: guild.id });

    if (option === "log") {
      if (enabled) {
        if (!channel)
          return interaction.reply({
            content: `No channel specified`,
            ephemeral: true,
          });

        if (channelDB) {
          await Rank.findOneAndUpdate(
            { Guild: guild.id },
            { logChannel: channel.id }
          );

          interaction.reply({
            embeds: [
              embed.setDescription(
                [
                  `You've just updated the rank log channel`,
                  `Moderator: <@${interaction.member.id}>`,
                  `\nChannel: <#${channel.id}>`,
                ].join("\n")
              ),
            ],
            ephemeral: true,
          });
        } else {
          const newRankDB = new Rank({
            Guild: guild.id,
            logChannel: channel.id,
          });
          await newRankDB.save();

          interaction.reply({
            embeds: [
              embed.setDescription(
                [
                  `You've just set-up the rank log channel`,
                  `Moderator: <@${interaction.member.id}>`,
                  `\nChannel: <#${channel.id}>`,
                ].join("\n")
              ),
            ],
            ephemeral: true,
          });
        }
      } else {
        if (!channelDB.logChannel)
          return interaction.reply({
            content: "There's no channel to delete",
            ephemeral: true,
          });

        await Rank.findOneAndDelete(
          { Guild: guild.id },
          { logChannel: channelDB.channel }
        );

        interaction.reply({
          embeds: [embed.setDescription(`Rank log channel has been deleted.`)],
          ephemeral: true,
        });
      }
    }

    if (option === "notification") {
      if (!channelDB) {
        const newNotif = new Rank({
          Guild: guild.id,
          notification: enabled,
        });
        await newNotif.save();
      } else {
        await Rank.findOneAndUpdate(
          { Guild: guild.id },
          { notification: enabled }
        );
      }

      return interaction.reply({
        embeds: [
          embed.setDescription(`Turned notification to \`${enabled}\`.`),
        ],
      });
    }
  },
};
