import { ButtonInteraction } from "discord.js";
import ShizuClient from "../../base/classes/ShizuClient";
import Button from "../../base/classes/Button";

export default class Test extends Button {
  constructor(client: ShizuClient) {
    super(client, {
      id: "test",
    });
  }

  Execute(interaction: ButtonInteraction, target: string) {
    interaction.reply({
      embeds: [
        this.client.config.createEmbed("default", `Test Button <@${target}>`),
      ],
      flags: 64,
    });
  }
}
