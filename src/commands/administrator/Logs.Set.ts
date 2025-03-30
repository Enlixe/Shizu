import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class LogsSet extends SubCommand {
  constructor(client: ShizuClient) {
    super(client, {
      name: "logs.set",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const logType = interaction.options.getString("log-type");
    const channel = interaction.options.getChannel("channel") as TextChannel;

    await interaction.deferReply({ flags: 64 });

    try {
      let guild = await GuildConfig.findOne({ guildId: interaction.guildId });
      if (!guild)
        guild = await GuildConfig.create({ guildId: interaction.guildId });

      //@ts-ignore
      guild.logs[`${logType}`].channelId = channel.id;

      await guild.save();

      return interaction.editReply({
        embeds: [
          this.client.config.createEmbed(
            "success",
            `✅ Updated \`${logType}\` logs to send to ${channel}`
          ),
        ],
      });
    } catch (error: unknown) {
      this.client.logger.error(
        `Failed to execute logs.set command: ${(error as Error).message}`,
        ["Command", "Logs"]
      );
      interaction.editReply({
        embeds: [
          this.client.config.createEmbed(
            "error",
            "❌ There was an error wile updating the database, please try again!"
          ),
        ],
      });
    }
  }
}
