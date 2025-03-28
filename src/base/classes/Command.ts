import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import Category from "../enums/Category";
import ICommand from "../interfaces/ICommand";
import ShizuClient from "./ShizuClient";
import ICommandOptions from "../interfaces/ICommandOptions";

export default class Command implements ICommand {
    client: ShizuClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permission: bigint;
    dm_permission: boolean;
    cooldown: number;

    constructor(client: ShizuClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.default_member_permission = options.default_member_permission;
        this.dm_permission = options.dm_permission;
        this.cooldown = options.cooldown;
    }
    Execute(interaction: ChatInputCommandInteraction): void {
        throw new Error("Method not implemented.");
    }
    AutoComplete(interaction: AutocompleteInteraction): void {
        throw new Error("Method not implemented.");
    }
    
}