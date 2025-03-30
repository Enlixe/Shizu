import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class Logs extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "logs",
      description: "Configure logging for your sever",
      category: Category.Administrator,
      default_member_permission: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
      cooldown: DEFAULT_COOLDOWN,
      options: [
        {
          name: "toggle",
          description: "Toggle the logs for your server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "Type of log to toggle",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "toggle",
              description: "Toggle the log",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
          ],
        },
        {
          name: "set",
          description: "Set the log channel for your server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "Type of log to toggle",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "channel",
              description: "Channel to set the log to",
              type: ApplicationCommandOptionType.Channel,
              required: true,
              channel_types: [ChannelType.GuildText],
            },
          ],
        },
      ],
    });
  }
}
