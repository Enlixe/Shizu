import { Collection } from "discord.js";
import Config from "../classes/Config";
import Logger from "../classes/Logger";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface IShizuClient {
  config: Config;
  logger: Logger;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;

  Init(): void;
  LoadHandlers(): void;
}
