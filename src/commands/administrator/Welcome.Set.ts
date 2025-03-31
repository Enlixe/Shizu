import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class WelcomeSet extends SubCommand {
  constructor(client: ShizuClient) {
    super(client, {
      name: "welcome.set",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel") as TextChannel;
    const msg = interaction.options.getString("msg");
    const attachment = interaction.options.getString("attachment");

    await interaction.deferReply({ flags: 64 });

    try {
      let guild = await GuildConfig.findOne({ guildId: interaction.guildId });
      if (!guild)
        guild = await GuildConfig.create({ guildId: interaction.guildId });

      guild.welcome.channelId = channel.id;
      guild.welcome.msg = msg || "";
      guild.welcome.attachment = attachment || "";

      await guild.save();

      return interaction.editReply({
        embeds: [
          this.client.config.createEmbed(
            "success",
            `✅ Updated \`welcomer\` to send to ${channel}\n` +
              `**» Message:** ${msg ?? "Default"}\n` +
              `**» Attachment:** ${attachment ?? "None"}`
          ),
        ],
      });
    } catch (error: unknown) {
      this.client.logger.error(
        `Failed to execute welcome.set command: ${(error as Error).message}`,
        ["Command", "Welcome"]
      );
      interaction.editReply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ There was an error while updating the database, please try again!"
          ),
        ],
      });
    }
  }
}
