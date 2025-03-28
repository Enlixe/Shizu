import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";
import ILogger from "./ILogger";

export default interface IShizuClient {
    config: IConfig;
    logger: ILogger;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>
    cooldowns: Collection<string, Collection<string, number>>

    Init(): void;
    LoadHandlers(): void;
}