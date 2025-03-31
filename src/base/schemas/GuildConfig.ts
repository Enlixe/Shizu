import { model, Schema } from "mongoose";

interface IGuildConfig {
  guildId: string;
  logs: {
    moderation: {
      enabled: boolean;
      channelId: string;
    };
  };
  welcome: {
    enabled: boolean;
    channelId: string;
    msg: string;
    attachment: string;
  };
}

export default model<IGuildConfig>(
  "GuildConfig",
  new Schema<IGuildConfig>(
    {
      guildId: String,
      logs: {
        moderation: {
          enabled: Boolean,
          channelId: String,
        },
      },
      welcome: {
        enabled: Boolean,
        channelId: String,
        msg: String,
        attachment: String,
      },
    },
    {
      timestamps: true,
    }
  )
);
