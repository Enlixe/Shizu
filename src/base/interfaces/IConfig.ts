import { ColorResolvable } from "discord.js";

export default interface IConfig {
  token: string;
  client_id: string;
  mongo_uri: string;

  dev_token: string;
  dev_client_id: string;
  dev_mongo_uri: string;
  dev_guild: string;
  dev_user: string[];
  // database: string;
  // debug: boolean;
  // debug_table: boolean;

  // devs: string[];
//   dev_guild: string[];

  color: {
    default: ColorResolvable;
  }
  //   red: ColorResolvable;
  //   green: ColorResolvable;
  // };

  // embed: {
  //   footer: string;
  // };

//   defaultEmbed: (description: string, title?: string) => Promise<EmbedBuilder>;
//   xpFormula: (level: number) => number;
//   fromServer: (server: string) => ActionRowBuilder;
}
