import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import ShizuClient from "../classes/ShizuClient";
import Category from "../enums/Category";

export default interface ICommand {
    client: ShizuClient
    name: string
    description: string
    category: Category
    options: object
    default_member_permission: bigint
    dm_permission: boolean
    cooldown: number
    dev: boolean

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}