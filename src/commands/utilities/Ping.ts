import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class Ping extends Command{
    constructor(client: ShizuClient){
        super(client, {
            name: "ping",
            description: "Ping, pong, ping...",
            category: Category.Utilities,
            default_member_permission: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: DEFAULT_COOLDOWN,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        const embed = this.client.config.createEmbed().setDescription(`🏓 Pong! Latency is **${this.client.ws.ping}ms**.`);
        interaction.reply({ embeds: [embed], flags: DEFAULT_FLAGS })
    }
}