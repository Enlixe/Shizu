import { ColorResolvable, EmbedBuilder, resolveColor } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

import IConfig from "../interfaces/IConfig";

export default class Config implements IConfig {
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

  constructor() {
    if (!process.env.TOKEN || !process.env.MONGO_URI)
      throw new Error(
        "Missing required environment variables: TOKEN or MONGO_URI"
      );

    this.token = process.env.TOKEN;
    this.client_id = `${process.env.CLIENT_ID}`;
    this.mongo_uri = process.env.MONGO_URI;

    (this.dev_token = `${process.env.DEV_TOKEN}`),
      (this.dev_client_id = `${process.env.DEV_CLIENT_ID}`),
      (this.dev_mongo_uri = `${process.env.DEV_MONGO_URI}`),
      (this.dev_guild = `${process.env.DEV_GUILD}`),
      (this.dev_user = ["524805915526955048"]),
      (this.color = {
        default: resolveColor("#7b00ff"),
        red: resolveColor("#ff0051"),
        green: resolveColor("#00fcb9"),
      });
  }

  createEmbed(
    type: "default" | "success" | "error",
    desc?: string
  ): EmbedBuilder {
    const embed = new EmbedBuilder();
    let _desc = "";

    switch (type) {
      case "default":
        embed.setColor(this.color.default);
        break;
      case "success":
        embed.setColor(this.color.green);
        _desc = "✅ Success.";
        break;
      case "error":
        embed.setColor(this.color.red);
        _desc = " ❌ An error occurred while executing the command.";
        break;
    }
    desc ? (desc = desc) : (desc = _desc);
    embed.setDescription(desc);
    return embed;
  }
}
