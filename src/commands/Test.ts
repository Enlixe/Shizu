import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import ShizuClient from "../base/classes/ShizuClient";
import Category from "../base/enums/Category";

export default class Test extends Command{
    constructor(client: ShizuClient){
        super(client, {
            name: "test",
            description: "Test command",
            category: Category.Utilities,
            default_member_permission: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 5,
            options: []
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: "Test command", flags: 64 })
    }
}