import { Client, Collection, ColorResolvable, EmbedBuilder, ActionRowBuilder, ClientOptions, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
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

export interface Command {
  subCommand?: string;
  data?: {
    name: string;
    toJSON: () => any; // Adjust the return type as necessary
  };
  folder?: string;
  name?: string;
  description?: string;
  developer?: boolean;
  autocomplete?: ChatInputCommandInteraction | AutocompleteInteraction;
  execute: (interaction: ChatInputCommandInteraction, bot: ShizuClient) => Promise<void>; // Specify both parameters
}

export class ShizuClient extends Client {
  public events: Collection<string, Event>; // Change to Event
  public commands: Collection<string, Command>; // Change to Command
  public subCommands: Collection<string, Command>; // Change to Command
  public buttons: Collection<string, Function>; // Adjust if you have a specific type for buttons
  public guildConfig: Collection<string, any>;
  public logger: Logger;
  public config: Config;

  constructor(options: ClientOptions) {
    super(options);
    this.events = new Collection<string, Event>(); // Initialize as Collection of Event
    this.commands = new Collection<string, Command>(); // Initialize as Collection of Command
    this.subCommands = new Collection<string, Command>(); // Initialize as Collection of Command
    this.buttons = new Collection<string, Function>(); // Adjust if you have a specific type for buttons
    this.guildConfig = new Collection<string, any>();
    this.logger = new Logger();
    this.config = {} as Config; // Initialize with an empty object or load your config later
  }
}