import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN } from "../../base/constants";

export default class Status extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "status",
      description: "Status command.",
      category: Category.Utilities,
      default_member_permission:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
      cooldown: DEFAULT_COOLDOWN,
      options: [],
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    let uptime: number = this.client.readyTimestamp
      ? parseInt((this.client.readyTimestamp / 1000).toString())
      : 0;
    let embed = this.client.config
      .createEmbed("default")
      .setDescription(
        `**Client**: \`🟢 ONLINE\` - \`${this.client.ws.ping}ms\`\n` +
          `**» Uptime**: <t:${uptime}:R>\n` +
          `**» Memory Usage**: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\n` +
          `**» Guilds**: \`${this.client.guilds.cache.size}\` guilds connected.\n` +
          `**» Users**: \`${this.client.users.cache.size}\` users connected.\n` +
          `**» Commands**: \`${this.client.commands.size}\` commands loaded.\n\n` +
          `**Database**: \`🟢 CONNECTED\`\n\n` +
          `**Tools**: \n` +
          `» **Node.js**: \`${process.version}\`\n` +
          `» **Discord.js**: \`${require("discord.js").version}\`\n` +
          `» **Mongoose**: \`${require("mongoose").version}\``
      )
      .setTitle(`Status`)
      .setAuthor({
        name: `${this.client.user?.username ?? ""}`,
        iconURL: `${this.client.user?.avatarURL() ?? ""}`,
      })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
}
