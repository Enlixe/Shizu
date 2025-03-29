import { ChatInputCommandInteraction } from "discord.js";
import ISubCommand from "../interfaces/ISubCommand";
import ShizuClient from "./ShizuClient";
import ISubCommandOptions from "../interfaces/ISubCommandOptions";

export default class SubCommand implements ISubCommand{
    client: ShizuClient;
    name: string;

    constructor(client: ShizuClient, options: ISubCommandOptions) {
        this.client = client;
        this.name = options.name
    }
    Execute(interaction: ChatInputCommandInteraction): void {
        throw new Error("Method not implemented.");
    }

}