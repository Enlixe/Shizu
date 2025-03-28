import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";

export default class DevOnly extends Command{
    constructor(client: ShizuClient){
        super(client, {
            name: "devonly",
            description: "Dev only command",
            category: Category.Utilities,
            default_member_permission: PermissionsBitField.Flags.Administrator,
            dm_permission: true,
            cooldown: 5,
            options: [],
            dev: true
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: "This is a developer command", flags: 64 })
    }
}