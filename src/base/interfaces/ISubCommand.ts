import { ChatInputCommandInteraction } from "discord.js";
import ShizuClient from "../classes/ShizuClient";

export default interface ISubCommand {
    client: ShizuClient
    name: string

    Execute(interaction: ChatInputCommandInteraction): void;
}