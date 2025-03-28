import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface IShizuClient {
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>
    cooldowns: Collection<string, Collection<string, number>>

    Init(): void;
    LoadHandlers(): void;
}