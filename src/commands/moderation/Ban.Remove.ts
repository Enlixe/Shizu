import {
  ChatInputCommandInteraction,
  GuildMember,
  GuildMemberRoleManager,
  TextChannel,
} from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BanRemove extends SubCommand {
  constructor(client: ShizuClient) {
    super(client, {
      name: "ban.remove",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getString("target");
    const reason =
      interaction.options.getString("reason") || "No reason was provided.";
    const silent = interaction.options.getBoolean("silent") || false;

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
      await interaction.guild?.bans.fetch(target!);
    } catch {
      return interaction.reply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ This user is not banned!    "
          ),
        ],
        flags: 64,
      });
    }

    try {
      await interaction.guild?.bans.remove(target!, reason);
    } catch {
      return interaction.reply({
        embeds: [this.client.config.createEmbed("error")],
        flags: 64,
      });
    }

    interaction.reply({
      embeds: [
        this.client.config.createEmbed("default", `🔨 Unbanned ${target}`),
      ],
      flags: 64,
    });

    if (!silent && interaction.channel instanceof TextChannel) {
      interaction.channel.send({
        embeds: [
          this.client.config
            .createEmbed("default", `**Reason:** \`${reason}\``)
            .setAuthor({ name: `🔨 Unban | ${target}` })
            .setTimestamp(),
        ],
      });

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
                `**User:** ${target}\n` + `**Reason:** ${reason}`
              )
              .setAuthor({ name: `🔨 Unban` })
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
