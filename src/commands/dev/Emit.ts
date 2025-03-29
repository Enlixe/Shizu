import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, Events, Guild, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";

export default class Emit extends Command{
    constructor(client: ShizuClient){
        super(client, {
            name: "emit",
            description: "Emit an event.",
            dev: true,
            category: Category.Developer,
            default_member_permission: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            cooldown: 1,
            options: [
                {
                    name: "event",
                    description: "The event to emit",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {name: "GuildCreate", value: Events.GuildCreate},
                        {name: "GuildDelete", value: Events.GuildDelete}
                    ]
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        const event = interaction.options.getString("event")

        if(event == Events.GuildCreate || event == Events.GuildDelete)
            this.client.emit(event, interaction.guild as Guild)

        interaction.reply({ embeds: [
            this.client.config.createEmbed().setDescription(`Emitted event - \`${event}\``)
        ], flags: 64 })
    }
}