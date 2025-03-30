import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  Events,
} from "discord.js";
import Event from "../../base/classes/Events";
import ShizuClient from "../../base/classes/ShizuClient";
import Command from "../../base/classes/Command";
import { DEFAULT_COOLDOWN } from "../../base/constants";

export default class ButtonHandler extends Event {
  constructor(client: ShizuClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: "Button Handler",
      once: false,
    });
  }
  async Execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const buttonCustomId = interaction.customId.split(":");

    let button;
    if (buttonCustomId[2])
      button =
        this.client.buttons.get(buttonCustomId[0] + ":" + buttonCustomId[1]) ||
        this.client.buttons.get(buttonCustomId[0]);
    else button = this.client.buttons.get(buttonCustomId[0]);
    if (!button)
      return await interaction.reply({
        embeds: [
          this.client.config.createEmbed("error", "This button doesn't exist."),
        ],
        flags: 64,
      });

    try {
      if (buttonCustomId[2]) button.Execute(interaction, buttonCustomId[2]);
      else if (buttonCustomId[1])
        button.Execute(interaction, buttonCustomId[1]);
      else button.Execute(interaction);
    } catch (error: any) {
      this.client.logger.error(
        `Error executing button ${button.id}: ${error.message}`,
        ["ButtonHandler"]
      );
      interaction.reply({
        embeds: [this.client.config.createEmbed("error")],
        ephemeral: true,
      });
    }
  }
}
