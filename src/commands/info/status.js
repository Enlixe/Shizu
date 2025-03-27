const { ChatInputCommandInteraction, Client } = require("discord.js");

module.exports = {
  folder: "info",
  name: "status",
  description: "Check the bot's status",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    let embed = await bot.config.defaultEmbed(
      `**Client**: \`🟢 ONLINE\` - \`${bot.ws.ping}ms\`
	    **» Uptime**: <t:${parseInt(bot.readyTimestamp / 1000)}:R>
	    **» Memory Usage**: \`${(
        process.memoryUsage().heapUsed /
        1024 /
        1024
      ).toFixed(2)} MB\`

	**Database**: \`🟢 CONNECTED\`

    **Tools**: 
    » **Node.js**: \`${process.version}\`
    » **Discord.js**: \`${require("discord.js").version}\`
    » **Mongoose**: \`${require("mongoose").version}\`\n`,
      `Status`
    );
    embed
      .addFields({
        name: "**Commands**",
        value: `\`${bot.commands.size}\` commands loaded.`,
        inline: true,
      })
      .addFields({
        name: "**Guilds**",
        value: `\`${bot.guilds.cache.size}\` guilds connected.`,
        inline: true,
      })
      .addFields({
        name: "**Users**",
        value: `\`${bot.users.cache.size}\` users connected.`,
        inline: true,
      })
      .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
      .setTimestamp();
    return interaction.followUp({ embeds: [embed], flags: 64 });
  },
};
