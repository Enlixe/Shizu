import { ActionRowBuilder, ColorResolvable, EmbedBuilder } from "discord.js";

export default interface IConfig {
  token: string;
  database: string;
  debug: boolean;
  debug_table: boolean;

  devs: string[];
//   dev_guild: string[];

  color: {
    default: ColorResolvable;
    red: ColorResolvable;
    green: ColorResolvable;
  };

  embed: {
    footer: string;
  };

//   defaultEmbed: (description: string, title?: string) => Promise<EmbedBuilder>;
//   xpFormula: (level: number) => number;
//   fromServer: (server: string) => ActionRowBuilder;
}
