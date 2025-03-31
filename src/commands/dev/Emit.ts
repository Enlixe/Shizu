import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Events,
  Guild,
  GuildMember,
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
            { name: "GuildMemberAdd", value: Events.GuildMemberAdd },
          ],
        },
      ],
    });
  }

  Execute(interaction: ChatInputCommandInteraction): void {
    try {
      const event: string = interaction.options.getString("event") as string;

      if (event == Events.GuildCreate || event == Events.GuildDelete)
        this.client.emit(event, interaction.guild as Guild);

      if (event == Events.GuildMemberAdd)
        this.client.emit(event, interaction.member as GuildMember);

      interaction.reply({
        embeds: [
          this.client.config
            .createEmbed("default")
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
        embeds: [this.client.config.createEmbed("error")],
        ephemeral: true,
      });
    }
  }
}
