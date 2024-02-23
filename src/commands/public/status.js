const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    folder: "information",
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Displays the status of the client and the database connection"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, bot) {
        const response = new EmbedBuilder()
			.setColor(bot.config.color.default)
			.setAuthor({name: bot.user.username, iconURL: bot.user.avatarURL()})
			.setDescription(`
				**Client**: \`🟢 ONLINE\` - \`${bot.ws.ping}ms\`
				**» Uptime**: <t:${parseInt(bot.readyTimestamp / 1000)}:R>
				**» Memory Usage**: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`

				**Database**: \`🟢 CONNECTED\`

				**Tools**: \n - **Node.js**: \`${process.version}\`\n - **Discord.js**: \`${require("discord.js").version}\`\n - **Mongoose**: \`${require("mongoose").version}\`\n
			`)
			.addFields({name:"**Commands**", value:`\`${bot.commands.size}\` commands loaded.`, inline: true})
			.addFields({name:"**Guilds**", value:`\`${bot.guilds.cache.size}\` guilds connected.`, inline: true})
			.addFields({name:"**Users**", value:`\`${bot.users.cache.size}\` users connected.`, inline: true})
			.setTimestamp();

		return interaction.reply({ embeds: [response] });
    },
};