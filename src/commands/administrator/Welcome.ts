import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import ShizuClient from "../../base/classes/ShizuClient";
import Category from "../../base/enums/Category";
import { DEFAULT_COOLDOWN, DEFAULT_FLAGS } from "../../base/constants";

export default class Welcome extends Command {
  constructor(client: ShizuClient) {
    super(client, {
      name: "welcome",
      description: "Configure welcomer for your sever",
      category: Category.Administrator,
      default_member_permission: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
      cooldown: DEFAULT_COOLDOWN,
      options: [
        {
          name: "toggle",
          description: "Toggle the welcomer for your server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "toggle",
              description: "Toggle the welcomer",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
          ],
        },
        {
          name: "set",
          description: "Set the greetings message when someone joins",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "channel",
              description: "Channel to send the message to",
              type: ApplicationCommandOptionType.Channel,
              required: true,
              channel_types: [ChannelType.GuildText],
            },
            {
              name: "msg",
              description: "Message that will be sent when someone joins",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "attachment",
              description: "Attachment that will be sent with the embed",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
      ],
    });
  }
}
