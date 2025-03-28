import { Events } from "discord.js";
import ShizuClient from "../classes/ShizuClient";

export default interface IEvent {
    client: ShizuClient;
    name: Events;
    description: string;
    once: boolean;
}