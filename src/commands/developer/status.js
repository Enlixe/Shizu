const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
module.exports = {
    folder: "information",
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Displays the status of the client and the database connection"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, bot) {
        const response = new MessageEmbed()
			.setColor("AQUA")
			.setAuthor(bot.user.username, bot.user.avatarURL())
			.setDescription(`
				**Client**: \`🟢 ONLINE\` - \`${bot.ws.ping}ms\`
				**» Uptime**: <t:${parseInt(bot.readyTimestamp / 1000)}:R>
				**» Memory Usage**: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`

				**Database**: \`${switchTo(connection.readyState)}\`

				**Tools**: \n - **Node.js**: \`${process.version}\`\n - **Discord.js**: \`${require("discord.js").version}\`\n - **Mongoose**: \`${require("mongoose").version}\`\n
			`)
			.addField("**Commands**", `\`${bot.commands.size}\` commands loaded.`, true)
			.addField("**Guilds**", `\`${bot.guilds.cache.size}\` guilds connected.`, true)
			.addField("**Users**", `\`${bot.users.cache.size}\` users connected.`, true)
			.setTimestamp();

		return interaction.reply({ embeds: [response] });
    },
};

function switchTo(val) {
	let status = " ";
	switch (val) {
	case 0: status = "🔴 DISCONNECTED";
		break;
	case 1: status = "🟢 CONNECTED";
		break;
	case 2: status = "🟠 CONNECTING";
		break;
	case 3: status = "🟣 DISCONNECTING";
		break;
	}
	return status;
}