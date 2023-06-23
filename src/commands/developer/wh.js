const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
  WebhookClient,
} = require("discord.js");

module.exports = {
  folder: "developer",
  developer: true,
  default_member_permissions: PermissionFlagsBits.ManageGuild,
  dm_permission: false,
  data: new SlashCommandBuilder()
    .setName("wh")
    .setDescription("Send a webhook")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
    .addStringOption((option) =>
      option
        .setName("op")
        .setDescription("channel")
        .setRequired(true)
        .addChoices(
          { name: "create", value: "create" },
          { name: "edit", value: "edit" },
          { name: "get", value: "get" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("channel")
        .addChoices(
          { name: "rules", value: "rules" },
          { name: "announcements", value: "announcements" },
          { name: "info", value: "info" },
          { name: "role", value: "role" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Role")
        .addChoices(
          { name: "dir", value: "dir" },
          { name: "level", value: "level" },
          { name: "booster", value: "booster" },
          { name: "reward", value: "reward" },
          { name: "currency", value: "currency" }
        )
    )
    .addStringOption((option) => option.setName("id").setDescription("Wh id"))
    .addStringOption((option) =>
      option.setName("json").setDescription("wh json")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const op = interaction.options.getString("op");
    let channel = interaction.options.getString("channel");
    let role = interaction.options.getString("role");
    let whid = interaction.options.getString("id");
    op == "create"
      ? null
      : whid
      ? null
      : (whid = (await interaction.channel.messages.fetch({ limit: 1 })).first()
          .id);
    let json = interaction.options.getString("json");

    const whName = "🌸";
    const whAvatar =
      "https://cdn.discordapp.com/attachments/1109487601095802940/1109487668875776111/faruzan.jpg";

    let embeds = [];
    let cLink;
    switch (channel) {
      case "rules":
        cLink =
          "https://discord.com/api/webhooks/1109493792794488892/8hljHBhGGicfpIoZSlUp2BR4LfBE2xTRc9kCho3lAi7RyyqT4bOd97w7-861hyepGrof";

        var embed = new EmbedBuilder().setColor(client.config.color.default);
        embed.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109661126674886796/genshin-impact-25-release-time-yae-miko-banner-1-550x309.jpg?width=494&height=278"
        );

        var embed2 = new EmbedBuilder().setColor(client.config.color.default);
        // embed2.setTitle("")
        embed2.setDescription(
          `**❀ :: __RULES__ .**\n\n` +
            `<:purpledash:1109488572081385542> Follow Discord's [TOS](https://discord.com/terms) and [Guidelines](https://discord.com/guidelines).\n` +
            `<:purpledash:1109488572081385542> No [NSFW](https://en.wikipedia.org/wiki/Not_safe_for_work) content.\n` +
            `<:purpledash:1109488572081385542> No racism, homophobia, transphobia, ableism, or other bigotry.\n` +
            `<:purpledash:1109488572081385542> No trolling, harassment, raiding, doxxing, or rude behavior.\n` +
            `<:purpledash:1109488572081385542> No advertising, solicitation or discussion of [RMT](https://en.wiktionary.org/wiki/RMT).\n` +
            `<:purpledash:1109488572081385542> No begging for nitro, roles, items or anything similar.\n` +
            `<:purpledash:1109488572081385542> No impersonation of any kinds.\n` +
            `<:purpledash:1109488572081385542> Sexualizing minors in any way will result in an immediate ban.\n` +
            `<:purpledash:1109488572081385542> Staff members always have final interpretation of the rules.`
        );
        embed2.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109488420759294003/purpledashmany.png?width=449&height=35"
        );

        var embed3 = new EmbedBuilder().setColor(client.config.color.default);
        // embed3.setTitle("**❀ :: __CAN'T ACCESS THE SERVER ?__ .**")
        embed3.setDescription(
          `**❀ :: __CAN'T ACCESS THE SERVER ?__ .**\n\n` +
            "Make sure that you've gone through our __on-boarding__ process using Discord's __channels & roles__ function (see image below)."
        );
        embed3.setImage(
          "https://support.discord.com/hc/article_attachments/10579905144343"
        );

        embeds.push(embed, embed2, embed3);
        break;
      case "announcements":
        cLink =
          "https://discord.com/api/webhooks/1109492244370706514/4InArBE6Jl5wvJ3ZAwsCes9nib48QRotaOt5ChljMDu6Gz8swCMZHuAFOUcvq7GLSMaS";

        var banner = new EmbedBuilder().setColor(client.config.color.default);
        banner.setImage(
          "https://cdn.discordapp.com/attachments/1109487601095802940/1109669201951596674/1221878.png"
        );

        var embed = new EmbedBuilder().setColor(client.config.color.default);
        embed.setTitle("❈ Big Updates for the Server! ❈");
        embed.setDescription(
          "Hello, I wanted to update you all about some changes I have implemented within the server!"
        );
        embed.addFields(
          {
            name: "**• Channel Overhaul!**",
            value:
              "As some of you might have noticed, I have updated all the channel, and created a new format.\n\n" +
              "<:purpledash:1109488572081385542> https://discord.com/channels/524807341879853060/853194482878513172 DONE\n" +
              "<:purpledash:1109488572081385542> https://discord.com/channels/524807341879853060/597646070411165696 DONE\n" +
              "<:purpledash:1109488572081385542> https://discord.com/channels/524807341879853060/1109428691341160468 DONE\n" +
              "<:purpledash:1109488572081385542> https://discord.com/channels/524807341879853060/837494765896335363 DONE\n" +
              "<:purpledash:1109488572081385542> https://discord.com/channels/524807341879853060/597945039963947016 DONE\n",
          },
          {
            name: "**• Bot Implementation!**",
            value:
              "As you can see, this message is sended by a bot (webhook). It's not a real user. In this format the message will be more clean and formatted. Hope you liked it <3\n\n" +
              "Implemented with help of <@722009574760120353>",
          }
        );
        embed.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109488420759294003/purpledashmany.png?width=449&height=35"
        );

        embeds.push(banner, embed);
        break;
      case "info":
        cLink =
          "https://discord.com/api/webhooks/1109496239147466912/MA_fMwAtVvnYUOlyjq4sfxHjGmi_y6mI-w6xax31lB4FCdzgVDGNNmHo6K7AHuga_fA7";

        var banner = new EmbedBuilder().setColor(client.config.color.default);
        banner.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109667594979516456/info.png"
        );

        var embed1 = new EmbedBuilder().setColor(client.config.color.default);
        embed1.setDescription(
          `\`\`\`📌 :: Important Channels\`\`\`\n` +
            `If you've lost your way on the path up to the peak of The Snowy Mountain, there's no need to worry. We've compiled a few points of interest for our fellow travelers.`
        );
        embed1.addFields(
          {
            name: "⠀",
            value:
              `https://discord.com/channels/524807341879853060/853194482878513172\n` +
              "Guidelines and rules that all users are expected to follow.\n\n" +
              `https://discord.com/channels/524807341879853060/597646070411165696\n` +
              "Applications, events, and other server notices are posted here.",
            inline: true,
          },
          {
            name: "⠀",
            value:
              `https://discord.com/channels/524807341879853060/1109428691341160468\n` +
              "Get all the needed information related to the server here.\n\n" +
              `https://discord.com/channels/524807341879853060/837494765896335363\n` +
              "Roles information and how to get them. _gotta get 'em all_",
            inline: true,
          }
        );
        embed1.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109488420759294003/purpledashmany.png?width=449&height=35"
        );

        var embed = new EmbedBuilder().setColor(client.config.color.default);
        embed.setDescription(`\`\`\`⛩️ :: Positions at Narukami Shrine\`\`\`⠀`);
        embed.addFields(
          {
            name: "⠀",
            value:
              `**・【Owner】 Joukai**\n` +
              "The role of __Joukai__ belongs to the current owner of Snowy. They are responsible for appointing administrators, play with his bot, and on occasion going to sleep at a reasonable hour.\n\n" +
              `**・【Admin】 Meikai**\n` +
              "__Meikai__ oversee the overall health and well-being of the server. They have broad administrative control, manage the staff teams.\n\n" +
              `**・【Mod】 Saint**\n` +
              "__Saint__ ensure that the shrine is a safe, healthy environment for everyone. They do tasks such as enforcing rules, watching conversations, solving member to member conflicts and showing moderation presence.",
            inline: true,
          },
          {
            name: "⠀",
            value:
              `**・【Trial Mod】 Spirit**\n` +
              "__Spirit__ are typically new mod undergoing training for the server. While they learn the ropes of the server, they access to moderation tools such as: warning, muting, and kicking unruly members.\n\n" +
              `**・【Helpers】 Soul**\n` +
              "__Soul__ is rewarded by Event staff and Moderators to members who are currently helping with ongoing events in the server. Their responsibilities are limited to just moderate and participate in the events created by staff.\n\n" +
              `**・Apply for Staff Here:**\n` +
              "<:purpledash:1109488572081385542> `./ closed`\n",
            inline: true,
          }
        );
        embed.setImage(
          "https://media.discordapp.net/attachments/1109487601095802940/1109488420759294003/purpledashmany.png?width=449&height=35"
        );

        embeds.push(banner, embed1, embed);
        break;
      case "role":
        cLink =
          "https://discord.com/api/webhooks/1109796384493801532/E3jjFivoUJwXB1Yv5QxiVEk7zLE7Z6uVAgoZG6fipIV_3VBopJDyx40idtsCKXJ71340";
        var banner = new EmbedBuilder().setColor(client.config.color.default);
        var embed = new EmbedBuilder().setColor(client.config.color.default);
        embed.setImage(
          "https://cdn.discordapp.com/attachments/1109487601095802940/1109792807280979978/blank.png"
        );
        var embed2;

        switch (role) {
          case "dir":
            banner.setImage(
              "https://media.discordapp.net/attachments/1109487601095802940/1109794731183067207/role.png"
            );
            embed.setDescription(
              `\`\`\`AsciiDoc\n⛩️ :: Role Directory\`\`\`\n` +
                "__Jump to:__\n" +
                `\`1.\` [Level Roles](https://discord.com/channels/524807341879853060/837494765896335363/1109802191281213460)\n` +
                `\`2.\` [Booster Roles](https://discord.com/channels/524807341879853060/837494765896335363/1109802363415429192)\n` +
                `\`3.\` [Reward Roles](https://discord.com/channels/524807341879853060/837494765896335363/1109802374412898355)\n` +
                `\`4.\` [Currency Roles](https://discord.com/channels/524807341879853060/837494765896335363/1109802383279665202)`
            );
            break;
          case "level":
            banner.setImage(
              "https://media.discordapp.net/attachments/1109487601095802940/1109799503743172618/inazuma-genshin-hvxlxgs9z2hz7yy3.png"
            );
            embed.setDescription(
              `\`\`\`AsciiDoc\n💮 :: Level Roles\`\`\`\n` +
                "Gain new ranks in the server through chatting and joining voice calls with others!"
            );
            embed.addFields(
              {
                name: "⠀",
                value:
                  "<@&795959428377083925>\n" +
                  "Base Role\n\n" +
                  "<@&1113711434644340846>\n" +
                  "New Permission(s):\n" +
                  "Attach Files, Embed Links\n\n" +
                  "<@&1113711578206969949>\n" +
                  "New Permission(s):\n" +
                  "Bypass duplicate message auto-filter",
                inline: true,
              },
              {
                name: "⠀",
                value:
                  "<@&1113755374084964392>\n" +
                  "New Permission(s):\n" +
                  "Bypass spam, and auto-filters\n" +
                  "Three extra giveaway entries\n\n" +
                  "<@&1113755418062241822>\n" +
                  "New Permission(s):\n" +
                  "Bypass Raffle Requirements\n\n" +
                  "<@&1113755438685634590>\n" +
                  "Our eternal love\n" +
                  "Three extra giveaway entries",
                inline: true,
              }
            );
            break;
          case "booster":
            banner.setImage(
              "https://cdn.discordapp.com/attachments/1109487601095802940/1109807008993001512/genshin-impact-inazuma-5.png"
            );
            embed.setDescription(
              `\`\`\`AsciiDoc\n🌸 :: Booster Roles\`\`\`` +
                `\nAs a thank you for supporting our server, we offer the following in honor of your generosity!` +
                `\n\n__Perks:__\n` +
                `\`1.\` Custom Role\n` +
                `\`2.\` _To be announced._`
            );
            embed2 = new EmbedBuilder().setColor(client.config.color.default);
            embed2.setImage(
              "https://cdn.discordapp.com/attachments/1109487601095802940/1109792807280979978/blank.png"
            );
            embed2.setTitle("Server Boosters");
            embed2.setDescription(
              "<@&852915752696676413>\n\n" +
                "Users who boost our server may claim a custom role through Booster Bot." +
                `**Create your role**: \`bb role claim RoleName\`

After your role is generated, you may customize it using:
**Name**: \`bb role name NewName\`
**Color**: \`bb role color #BFFF00\`
**Icon**: \`bb role icon emoji/attachment\``
            );
            break;
          case "reward":
            banner.setImage(
              "https://cdn.discordapp.com/attachments/915766175395364864/927846980326162442/IMG_1523.png"
            );
            embed.setDescription(
              `\`\`\`AsciiDoc\n🎖️ :: Reward Roles\`\`\`` +
                `\nReceive vanity roles through reaching various milestones\n\n` +
                `When applying for your reward role, please include your Discord ID and any relevant screenshots.`
            );
            embed2 = new EmbedBuilder().setColor(client.config.color.default);
            embed2.setImage(
              "https://cdn.discordapp.com/attachments/1109487601095802940/1109792807280979978/blank.png"
            );
            embed2.setTitle("**Social Media**");
            embed2.setDescription(
              "<@&1030087412069711883>\n" +
                `Have 1k subscribers on [YouTube](https://youtube.com)\n\n` +
                // "TBA\n" +
                // "TBA SOON\n\n" +
                `[Apply for your reward role here!](https://discord.com/channels/524807341879853060/837494765896335363/1109802374412898355)`
            );
            break;
          case "currency":
            banner.setImage(
              "https://cdn.discordapp.com/attachments/915766175395364864/927846980724621362/IMG_1525.png"
            );
            embed.setDescription(
              `\`\`\`AsciiDoc\n💰 :: Currency Roles\`\`\`` +
                `\nEarn currency through one of our many economy bots and exchange it for vanity roles!`
            );
            embed.addFields({
              name: `**Obtainable Roles**`,
              value:
                `<@&1053200373516599308>\n` +
                `S — To be announced.\n\n` +
                `<@&980740864382992424>\n` +
                `S — To be announced.\n\n` +
                `<@&952767469305597972>\n` +
                `S — To be announced.\n\n` +
                `<@&914072192562655232>\n` +
                `S — To be announced.\n\n` +
                `Note: Roles within the same perk category **will** stack!`,
            });
            break;
        }

        embeds.push(banner, embed);
        embed2 ? embeds.push(embed2) : null;
        break;
    }

    let webhookClient;
    if (cLink) webhookClient = new WebhookClient({ url: cLink });
    else {
      const cn = client.channels.cache.get(interaction.channelId);
      console.log(cn);
      const webhooks = await cn.fetchWebhooks();
      webhookClient = webhooks.first();
    }

    if (op == "create") {
      await webhookClient.send({
        username: whName,
        avatar: whAvatar,
        embeds: embeds,
        channel: interaction.channelId,
      });
      return interaction.followUp({
        content: `Successfully created the webhook`,
        ephemeral: true,
      });
    } else if (op == "edit") {
      if (json) {
        json = json.replace(
          /:purpledash:/g,
          "<:purpledash:1109488572081385542>"
        );
        json = JSON.parse(json);
        embeds = [];
        json.forEach((embed) => {
          embeds.push(embed);
        });
      }
      await webhookClient.editMessage(whid, {
        embeds: embeds,
      });

      return interaction.followUp({
        content: `Successfully edited the webhook with id ${whid}`,
        ephemeral: true,
      });
    } else if (op == "get") {
      let data = await webhookClient.fetchMessage(whid);
      data = data.embeds;
      const msg = JSON.stringify(data, null, 2);
      return interaction.followUp({
        content: msg,
        ephemeral: true,
      });
    }
  },
};
