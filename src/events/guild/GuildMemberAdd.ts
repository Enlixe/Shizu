import {
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildMemberAdd extends Event {
  constructor(client: ShizuClient) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: "Guild Member Add",
      once: false,
    });
  }

  async Execute(member: GuildMember) {
    try {
      const { user, guild } = member;
      const config = await GuildConfig.findOne({ guildId: guild.id });
      if (!config?.welcome.enabled) return;
      let { channelId, msg, attachment } = config.welcome;

      if (!msg || msg.trim() === "")
        msg = `Welcome ${user} to ${guild.name}.\nWe hope you enjoy your stay here!`;
      else
        msg = msg
          .replace(/\${user}/g, `${user}`)
          .replace(/\${server}/g, guild.name)
          .replace(/\\n/g, "\n");

      let embed = this.client.config
        .createEmbed("default", msg)
        .setAuthor({
          name: `${user.username}`,
          iconURL: `${user.avatarURL()}`,
        })
        .setFooter({
          text: `${guild.name}`,
          iconURL: `${guild.iconURL()}`,
        })
        .setTimestamp();

      attachment ? embed.setImage(attachment) : null;
      ((await guild.channels.fetch(channelId)) as TextChannel)
        .send({
          content: `${user}`,
          embeds: [embed],
        })
        .catch((err) => {
          this.client.logger.error(
            `Failed to send welcome message: ${err.message}`,
            ["Event", "GuildMemberAdd"]
          );
        });
    } catch (error: any) {
      this.client.logger.error(
        `Error in GuildMemberAdd event: ${error.message}`,
        ["Event", "GuildMemberAdd"]
      );
    }
  }
}
