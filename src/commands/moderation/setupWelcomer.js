const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const welcomeSchema = require("../../structures/schemas/welcomer");
const { addConfig } = require("../../structures/functions/configLoader");

module.exports = {
  folder: "moderation",
  data: new SlashCommandBuilder()
    .setName("welcomer")
    .setDescription("Configure the welcomer system for this guild.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((sc) =>
      sc
        .setName("disable")
        .setDescription("Disable and delete the data on this guild.")
    )
    .addSubcommand((sc) =>
      sc
        .setName("welcome")
        .setDescription("Set or replace the welcome message channel.")
        .addChannelOption((op) =>
          op
            .setName("channel")
            .setDescription("Channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((op) =>
          op
            .setName("message")
            .setDescription(
              "The welcome messages. (if not provided will set to default msg)"
            )
        )
        .addStringOption((op) =>
          op
            .setName("attachment")
            .setDescription("The welcome messages attachment.")
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "welcome":
        const channel = interaction.options.getChannel("channel");
        const msg = interaction.options.getString("message");
        const attachment = interaction.options.getString("attachment");
        const joinSys = await welcomeSchema.findOne({
          Guild: interaction.guild.id,
        });
        if (!joinSys) {
          joinChannel = new welcomeSchema({
            Guild: interaction.guild.id,
            welcomeChannel: channel.id,
            welcomeMsg: msg,
            welcomeAttchment: attachment,
          });

          addConfig(bot, interaction.guild.id, {
            welcomeChannel: channel.id,
            welcomeMsg: msg,
            welcomeAttchment: attachment,
          });

          await joinChannel.save().catch((err) => console.log(err));
          const successEmbed = new EmbedBuilder()
            .setTitle("Welcomer")
            .setDescription(
              [
                `Enabled welcome message in **${channel}**!`,
                `\nMessage:`,
                `\`\`\`${msg}\`\`\``,
                "Attachment:",
                `${attachment}`,
              ].join("\n")
            )
            .setColor(bot.config.color.default)
            .setFooter({ text: bot.config.embed.footer });
          await interaction.reply({
            embeds: [successEmbed],
            ephemeral: true,
          });
        }
        if (joinSys) {
          await welcomeSchema.findOneAndUpdate(
            { Guild: interaction.guild.id },
            { Channel: channel.id }
          );
          const successEmbed = new EmbedBuilder()
            .setTitle("Welcomer")
            .setDescription(`Updated welcome message in **${channel.name}**!`)
            .setColor(bot.config.color.default)
            .setFooter({ text: bot.config.embed.footer });

          await interaction.reply({
            embeds: [successEmbed],
            ephemeral: true,
          });
          addConfig(bot, interaction.guild.id, {
            welcomeChannel: channel.id,
            welcomeMsg: msg,
            welcomeAttchment: attachment,
          });
        }
        break;
      case "disable":
        await welcomeSchema.findOneAndDelete({
          Guild: interaction.guild.id,
        });
        const successEmbed = new EmbedBuilder()
          .setTitle("Welcomer")
          .setDescription(`Successfully deleted the data in this guild.`)
          .setColor(bot.config.color.default)
          .setFooter({ text: bot.config.embed.footer });
        await interaction.reply({
          embeds: [successEmbed],
          ephemeral: true,
        });
        addConfig(bot, interaction.guild.id, {
          welcomeChannel: null,
          welcomeMsg: null,
          welcomeAttchment: null,
        });
        break;
    }
  },
};
