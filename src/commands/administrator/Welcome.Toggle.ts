import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class WelcomeToggle extends SubCommand {
  constructor(client: ShizuClient) {
    super(client, {
      name: "welcome.toggle",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const enabled = interaction.options.getBoolean("toggle") as boolean;

    await interaction.deferReply({ flags: 64 });

    try {
      let guild = await GuildConfig.findOne({ guildId: interaction.guildId });
      if (!guild)
        guild = await GuildConfig.create({ guildId: interaction.guildId });

      guild.welcome.enabled = enabled;

      await guild.save();

      return interaction.editReply({
        embeds: [
          this.client.config.createEmbed(
            "success",
            `✅ **${enabled ? "Enabled" : "Disabled"}** \`welcomer\`!`
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
