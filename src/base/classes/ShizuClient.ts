// import { Client, Collection, ColorResolvable, EmbedBuilder, ActionRowBuilder, ClientOptions, ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
// import Logger from "../functions/logger";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import IShizuClient from "../interfaces/IShizuClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";

// export interface Event {
//   name: string;
//   once?: boolean;
//   rest?: boolean;
//   execute: (...args: any[]) => Promise<void>;
// }

// export interface Command {
//   folder: string;
//   name?: string;
//   description?: string;
//   developer?: boolean;
//   data?: {
//     name: string;
//     toJSON: () => any; // Adjust the return type as necessary
//   };
//   subCommand?: string;
//   // autocomplete?: ChatInputCommandInteraction | AutocompleteInteraction;
//   execute: (interaction: ChatInputCommandInteraction, bot: ShizuClient) => Promise<void>; // Specify both parameters
// }

export default class ShizuClient extends Client implements IShizuClient {
  // public logger: Logger;
  devMode: boolean;
  handler: Handler; 
  config: IConfig;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;

  constructor(){
    super({ intents: [GatewayIntentBits.Guilds] });

    this.devMode = (process.argv.slice(2).includes("--dev"))
    this.config = require(`${process.cwd()}/src/config.ts`).config;
    this.handler = new Handler(this)
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
  }
  Init(): void {
    console.log(`Starting the bot in ${this.devMode ? "development" : "production"} mode.`)
    this.LoadHandlers()

    this.login(this.devMode ? this.config.dev_token : this.config.token).catch((err) => console.error(err));
  
    connect(this.devMode ? this.config.dev_mongo_uri : this.config.mongo_uri)
      .then(()=> console.log(`Connected to MongoDB.`))
      .catch((err)=> console.error(err))
  }
  LoadHandlers(): void {
    this.handler.LoadEvents()
    this.handler.LoadCommands()
  }

  // public events: Collection<string, Event>;
  // public commands: Collection<string, Command>;
  // public subCommands: Collection<string, Command>;
  // public buttons: Collection<string, Function>;
  // public guildConfig: Collection<string, any>;

  // constructor(options: ClientOptions) {
  //   super(options);
  //   this.logger = new Logger();
  //   this.config = {} as Config;

  //   this.events = new Collection<string, Event>();
  //   this.commands = new Collection<string, Command>();
  //   this.subCommands = new Collection<string, Command>(); 
  //   this.buttons = new Collection<string, Function>();
  //   // this.guildConfig = new Collection<string, any>();
  // }
}