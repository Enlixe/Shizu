import { Events } from "discord.js";
import ShizuClient from "./ShizuClient";
import IEvent from "../interfaces/IEvent";
import IEventOptions from "../interfaces/IEventOptions";

export default class Event implements IEvent {
  client: ShizuClient;
  name: Events;
  description: string;
  once: boolean;

  constructor(client: ShizuClient, options: IEventOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.once = options.once;
  }

  Execute(...args: any[]): void {};
}
