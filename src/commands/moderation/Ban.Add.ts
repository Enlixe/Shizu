import {
  ChatInputCommandInteraction,
  GuildMember,
  GuildMemberRoleManager,
  TextChannel,
} from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BanAdd extends SubCommand {
  constructor(client: ShizuClient) {
    super(client, {
      name: "ban.add",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason was provided.";
    const days = interaction.options.getInteger("days") || 0;
    const silent = interaction.options.getBoolean("silent") || false;

    if (!target)
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ Please provide a valid user!"
          ),
        ],
        flags: 64,
      });

    if (target.id == interaction.user.id)
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ You cannot ban yourself."
          ),
        ],
        flags: 64,
      });

    if (
      target.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    )
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ You cannot ban a user with a higher or equal roles than you!"
          ),
        ],
        flags: 64,
      });

    if (!target.bannable)
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ This user cannot be banned!"
          ),
        ],
        flags: 64,
      });

    if (reason.length > 512)
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ This reason cannot be longer than 512 chars!"
          ),
        ],
        flags: 64,
      });

    try {
      await target.send({
        embeds: [
          await this.client.config.createEmbed(
            "default",
            `🔨 You were **banned** from \`${interaction.guild?.name}\` by ${interaction.member}\n` +
              `If you would like to appeal your ban, send a message to the moderator who banned you\n\n` +
              `**Reason:** \`${reason}\``
          ),
        ],
      });
    } catch {}

    try {
      await target.ban({ deleteMessageSeconds: days, reason: reason });
    } catch {
      return interaction.reply({
        embeds: [this.client.config.createEmbed("error")],
        flags: 64,
      });
    }

    interaction.reply({
      embeds: [
        this.client.config.createEmbed(
          "default",
          `🔨 Banned ${target} - \`${target.id}\``
        ),
      ],
      flags: 64,
    });

    if (!silent && interaction.channel instanceof TextChannel) {
      interaction.channel
        .send({
          embeds: [
            this.client.config
              .createEmbed(
                "default",
                `**Reason:** \`${reason}\`\n` +
                  `${days == 0 ? "" : `This users messages in the last \`${days / 60 / 60}\` hours have been deleted`}`
              )
              .setThumbnail(target.displayAvatarURL({ size: 64 }))
              .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
              .setTimestamp()
              .setFooter({ text: `Id: ${target.id}` }),
          ],
        })
        .then(async (x) => await x.react("🔨"));

      const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

      if (
        guild &&
        guild?.logs?.moderation?.enabled &&
        guild?.logs?.moderation?.channelId
      )
        (
          (await interaction.guild?.channels.fetch(
            guild.logs.moderation.channelId
          )) as TextChannel
        )?.send({
          embeds: [
            this.client.config
              .createEmbed(
                "default",
                `**User:** ${target} - \`${target.id}\`\n` +
                  `**Reason:** ${reason}\n` +
                  `${days == 0 ? "" : `This users messages in the last \`${days / 60 / 60}\` hours have been deleted`}`
              )
              .setThumbnail(target.displayAvatarURL({ size: 64 }))
              .setAuthor({ name: `🔨 Ban` })
              .setTimestamp()
              .setFooter({
                text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL({}),
              }),
          ],
        });
    }
  }
}
