const {
  ChatInputCommandInteraction,
  Client,
  AttachmentBuilder,
} = require("discord.js");
const { Rank } = require("canvacord");
const UserDB = require("../../../structures/schemas/user");

module.exports = {
  subCommand: "rank.me",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} bot
   */
  async execute(interaction, bot) {
    await interaction.deferReply();

    const { options, guild } = interaction;
    const member = options.getMember("user") || interaction.member;

    const Guild = member.guild.id;
    const User = member.user.id;

    let user;
    user = await UserDB.findOne({ Guild, User });
    if (!user) user = { level: 1, xp: 0 };

    let xpFormula = bot.config.xpFormula(user.level);
    const rank = new Rank()
      .setAvatar(member.user.displayAvatarURL())
      .setCurrentXP(user.xp)
      .setLevel(user.level)
      .setRank(0, 0, false)
      .setRequiredXP(xpFormula)
      .setStatus(member.presence.status)
      .setProgressBar(bot.config.color.default, "COLOR")
      .setUsername(member.user.username)
      //   .setBackground(
      //     "IMAGE",
      //     "https://wallpapertag.com/wallpaper/full/e/c/6/477550-most-popular-hubble-ultra-deep-field-wallpaper-1920x1200.jpg" // Change to your background image just URL
      //   )
      .setDiscriminator(member.user.discriminator);

    rank.build().then((data) => {
      interaction.followUp({
        files: [new AttachmentBuilder(data, { name: "rank.png" })],
      });
    });
  },
};
