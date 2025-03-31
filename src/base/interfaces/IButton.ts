import { ButtonInteraction, ChatInputCommandInteraction } from "discord.js";
import ShizuClient from "../classes/ShizuClient";

export default interface IButton {
  client: ShizuClient;
  id: string;

  Execute(interaction: ButtonInteraction): void;
}
