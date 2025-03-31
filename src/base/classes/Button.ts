import { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";
import ShizuClient from "./ShizuClient";
import IButton from "../interfaces/IButton";
import IButtonOptions from "../interfaces/IButtonOptions";

export default class Button implements IButton {
  client: ShizuClient;
  id: string;

  constructor(client: ShizuClient, options: IButtonOptions) {
    this.client = client;
    this.id = options.id;
  }
  Execute(interaction: ButtonInteraction, ...args: any[]): void {
    throw new Error("Method not implemented.");
  }
}
