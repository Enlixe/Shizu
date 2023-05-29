const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  folder: "information",
  data: new SlashCommandBuilder()
    .setName("memberinfo")
    .setDescription("View your or any member's information.")
    .setDMPermission(false)
    .addUserOption((op) =>
      op
        .setName("member")
        .setDescription(
          "View a member's information. Leave empty to view your own."
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, bot) {
    await interaction.deferReply({ ephemeral: true });
    const member =
      interaction.options.getMember("member") || interaction.member;

    if (member.user.bot)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(
            "At this moment, bots are not supported for this command."
          ),
        ],
        ephemeral: true,
      });

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const joinPosition =
        Array.from(
          fetchedMembers
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .keys()
        ).indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const booster = member.premiumSince
        ? "<:discordboost:1110512701161086997>"
        : "✖";

      const Embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag} | Information`,
          iconURL: member.displayAvatarURL(),
        })
        .setColor(member.displayColor)
        .setFooter({ text: bot.config.embed.footer })
        .setDescription(
          `On <t:${joinTime}:D>, ${
            member.user.username
          } joined as the **${addSuffix(joinPosition)}** member of this guild`
        )
        //   .setImage("attachment://profile.png")
        .addFields([
          {
            name: "Badges",
            value: `${addBadges(userBadges).join("")}`,
            inline: true,
          },
          { name: "Booster", value: `${booster}`, inline: true },
          {
            name: "Top Roles",
            value: `${topRoles
              .join("")
              .replace(interaction.guild.roles.everyone, "")}`,
            inline: false,
          },
          { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Joined", value: `<t:${joinTime}:R>`, inline: true },
          { name: "Identifier", value: `${member.id}`, inline: false },
          {
            name: "Avatar",
            value: `[Link](${member.displayAvatarURL()})`,
            inline: true,
          },
          {
            name: "Banner",
            value: `${
              (await member.user.fetch()).bannerURL()
                ? `[Link](${(await member.user.fetch()).bannerURL()})`
                : `None`
            }`,
            inline: true,
          },
        ]);

      interaction.editReply({ embeds: [Embed] });
    } catch (err) {
      interaction.editReply({
        content: "An error occured: Contact The Developer",
      });
      bot.logger.log(`Error occured at memberInfo.js: ` + err, ["COMMANDS"]);
    }
  },
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13) return number + "th";

  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
  }

  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    ActiveDeveloper: "<:activedeveloper:1110512697667244033>",
    BugHunterLevel1: "<:discordbughunter1:1110512706919874644>",
    BugHunterLevel2: "<:discordbughunter2:1110512711076429824>",
    PremiumEarlySupporter: "<:discordearlysupporter:1110512713592995883>",
    Partner: "<:discordpartner:1110512722522673242>",
    Staff: "<:discordstaff:1110512725836173392>",
    HypeSquadOnlineHouse1: "<:hypesquadbravery:1110512730886131818>", // bravery
    HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1110512734589694073>", // brilliance
    HypeSquadOnlineHouse3: "<:hypesquadbalance:1110512729162272898>", // balance
    Hypesquad: "<:hypesquadevents:1110512738603651092>",
    CertifiedModerator: "<:discordmod:1110512717044916244>",
    VerifiedDeveloper: "<:discordbotdev:1110512703715426334>",
    /*
      
      <:olddiscordmod:1110512740625305660> 
      <:discordnitro:1110512720614264842> 
      */
  };

  return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
}
