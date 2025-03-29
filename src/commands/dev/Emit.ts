import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  Guild,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class Emit extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "emit",
      description: "Emit an event.",
      dev: true,
      category: Category.Developer,
      default_member_permission: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
      cooldown: DEFAULT_COOLDOWN,
      options: [
        {
          name: "event",
          description: "The event to emit",
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "GuildCreate", value: Events.GuildCreate },
            { name: "GuildDelete", value: Events.GuildDelete },
          ],
        },
      ],
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    try {
      const event = interaction.options.getString("event");

      if (event == Events.GuildCreate || event == Events.GuildDelete) {
        this.client.emit(event, interaction.guild as Guild);
      }

      interaction.reply({
        embeds: [
          this.client.config
            .createEmbed()
            .setDescription(`Emitted event - \`${event}\``),
        ],
        flags: DEFAULT_FLAGS,
      });
    } catch (error: any) {
      this.client.logger.error(
        `Failed to execute emit command: ${error.message}`,
        ["Command", "Emit"]
      );
      interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  }
}
