import { Client, Collection, ColorResolvable, EmbedBuilder, ActionRowBuilder } from "discord.js";
import Logger from "./structures/functions/logger";

export interface Config {
  token: string;
  database: string;
  debug: boolean;
  table: boolean;
  developers: string[];
  color: {
    default: ColorResolvable;
    red: ColorResolvable;
    green: ColorResolvable;
  };
  embed: {
    footer: string;
  };
  defaultEmbed: (description: string, title?: string) => Promise<EmbedBuilder>;
  xpFormula: (level: number) => number;
  fromServer: (server: string) => ActionRowBuilder;
}

export interface Event {
  name: string;
  execute: (...args: any[]) => void;
  once?: boolean;
  rest?: boolean;
}

export class ShizuClient extends Client {
  public events: Collection<string, Function>;
  public commands: Collection<string, Function>;
  public subCommands: Collection<string, Function>;
  public buttons: Collection<string, Function>;
  public guildConfig: Collection<string, any>;
  public logger: Logger;
  public config: Config;

  constructor(options: any) {
    super(options);
    this.events = new Collection<string, Function>(); // Initialize as Collection
    this.commands = new Collection<string, Function>();
    this.subCommands = new Collection<string, Function>();
    this.buttons = new Collection<string, Function>();
    this.guildConfig = new Collection<string, any>();
    this.logger = new Logger();
    this.config = {} as Config; // Initialize with an empty object or load your config later
  }
}