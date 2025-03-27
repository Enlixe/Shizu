import { ChatInputCommandInteraction } from "discord.js";
import { ShizuClient, Command } from "../../ShizuClient"; // Adjust the import path as necessary

const statusCommand: Command = {
  folder: "info",
  name: "status",
  description: "Check the bot's status",
  async execute(interaction: ChatInputCommandInteraction, bot: ShizuClient): Promise<void> {
    let uptime: number = bot.readyTimestamp 
      ? parseInt((bot.readyTimestamp / 1000).toString()) 
      : 0;
    let embed = await bot.config.defaultEmbed(`
    **Client**: \`🟢 ONLINE\` - \`${bot.ws.ping}ms\`
	  **» Uptime**: <t:${uptime}:R>
	  **» Memory Usage**: \`${(
        process.memoryUsage().heapUsed /
        1024 /
        1024
      ).toFixed(2)} MB\`
    **» Guilds**: \`${bot.guilds.cache.size}\` guilds connected.
    **» Users**: \`${bot.users.cache.size}\` users connected.
    **» Commands**: \`${bot.commands.size}\` commands loaded.

	  **Database**: \`🟢 CONNECTED\`

    **Tools**: 
    » **Node.js**: \`${process.version}\`
    » **Discord.js**: \`${require("discord.js").version}\`
    » **Mongoose**: \`${require("mongoose").version}\``,
    `Status`
    )
    embed
      .setAuthor({ name: bot.user?.username ?? "-", iconURL: bot.user?.avatarURL() ?? "" })
      .setTimestamp();
    interaction.followUp({ embeds: [embed] });
    return;
  },
};

export = statusCommand;
