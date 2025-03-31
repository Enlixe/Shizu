import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class Test extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "test",
      description: "Test command.",
      category: Category.Utilities,
      default_member_permission:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
      cooldown: DEFAULT_COOLDOWN,
      options: [],
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      embeds: [this.client.config.createEmbed("default", "Test command.")],
      flags: DEFAULT_FLAGS,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`test:${interaction.user.id}`)
            .setLabel("Test button")
            .setEmoji("🌸")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });
  }
}
