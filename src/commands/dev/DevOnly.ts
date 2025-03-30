import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class DevOnly extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "devonly",
      description: "Dev only command.",
      category: Category.Developer,
      default_member_permission: PermissionsBitField.Flags.Administrator,
      dm_permission: true,
      cooldown: DEFAULT_COOLDOWN,
      options: [],
      dev: true,
    });
  }

  Execute(interaction: ChatInputCommandInteraction): void {
    interaction.reply({
      embeds: [
        this.client.config
          .createEmbed("default")
          .setDescription("This is a developer command."),
      ],
      flags: DEFAULT_FLAGS,
    });
  }
}
