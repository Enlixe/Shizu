import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";

export default class Status extends Command{
    constructor(client: ShizuClient){
        super(client, {
            name: "status",
            description: "Status command",
            category: Category.Utilities,
            default_member_permission: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        let uptime: number = this.client.readyTimestamp ? parseInt((this.client.readyTimestamp / 1000).toString()) : 0;
        let embed = new EmbedBuilder()
            .setDescription(`
            **Client**: \`🟢 ONLINE\` - \`${this.client.ws.ping}ms\`
            **» Uptime**: <t:${uptime}:R>
            **» Memory Usage**: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`
            **» Guilds**: \`${this.client.guilds.cache.size}\` guilds connected.
            **» Users**: \`${this.client.users.cache.size}\` users connected.
            **» Commands**: \`${this.client.commands.size}\` commands loaded.
        
            **Database**: \`🟢 CONNECTED\`
        
            **Tools**: 
            » **Node.js**: \`${process.version}\`
            » **Discord.js**: \`${require("discord.js").version}\`
            » **Mongoose**: \`${require("mongoose").version}\``)
            .setTitle(`Status`)
            .setAuthor({ name: this.client.user?.username ?? "-", iconURL: this.client.user?.avatarURL() ?? "" })
            .setTimestamp();
        
        interaction.reply({ embeds: [embed], flags: 64 })
    }
}