import { Client, Collection, GatewayIntentBits } from "discord.js";
import IShizuClient from "../interfaces/IShizuClient";
import Handler from "./Handler";
import Logger from "../helpers/Logger";
import Config from "./Config";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";

export default class ShizuClient extends Client implements IShizuClient {
  devMode: boolean;
  handler: Handler; 
  logger: Logger;
  config: Config;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;

  constructor(){
    super({ intents: [GatewayIntentBits.Guilds] });

    this.devMode = (process.argv.slice(2).includes("--dev"))
    this.config = new Config()
    this.logger = new Logger()
    this.handler = new Handler(this)
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
  }
  Init(): void {
    this.logger.log(`Starting the bot in ${this.devMode ? "development" : "production"} mode.`, ["Bot"]);
    this.LoadHandlers();

    this.login(this.devMode ? this.config.dev_token : this.config.token)
        .catch((err) => {
            this.logger.error(`Failed to log in: ${err.message}`, ["ShizuClient", "Init"]);
            console.error(err);
        });

    connect(this.devMode ? this.config.dev_mongo_uri : this.config.mongo_uri)
        .then(() => this.logger.log(`Connected to MongoDB.`, ["DB"]))
        .catch((err) => {
            this.logger.error(`Failed to connect to MongoDB: ${err.message}`, ["ShizuClient", "Init"]);
            console.error(err);
        });
  }
  LoadHandlers(): void {
    this.handler.LoadEvents()
    this.handler.LoadCommands()
  }
}