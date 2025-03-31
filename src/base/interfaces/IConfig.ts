import { ColorResolvable, EmbedBuilder } from "discord.js";

export default interface IConfig {
  token: string;
  client_id: string;
  mongo_uri: string;

  dev_token: string;
  dev_client_id: string;
  dev_mongo_uri: string;
  dev_guild: string;
  dev_user: string[];
  color: {
    default: ColorResolvable;
    red: ColorResolvable;
    green: ColorResolvable;
  };
}
