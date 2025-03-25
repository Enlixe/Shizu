const { EmbedBuilder, Client, Message } = require("discord.js");
const UserDB = require("../../structures/schemas/user");
const RankLog = require("../../structures/schemas/rank");

const cooldown = new Set();

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const Guild = message.guild.id;
    const User = message.author.id;

    if (message.author.bot || !message.guild) return;
    if (cooldown.has(User)) return;
    let _rank = await RankLog.findOne({ Guild: Guild })
    if (!_rank) return console.log("A"); 
    if (!_rank.enabled) return console.log(_rank.enabled); 
    let user;

    const cdRand = Math.floor(Math.random() * 45) + 1;

    await UserDB.findOneAndUpdate(
      { Guild, User },
      { Guild, User },
      { upsert: true, new: true }
    );

    try {
      const xpLevel = (await UserDB.findOne({ Guild, User })).level;
      const xpAmount = Math.floor(
        (Math.random() * 0.5 + 0.5) *
          (Math.pow(xpLevel, 2.3) / (xpLevel * 0.3) +
            25 * (xpLevel / ((xpLevel === 1 ? 2 : xpLevel) - 1)))
      );

      user = await UserDB.findOneAndUpdate(
        { Guild, User },
        { Guild, User, $inc: { xp: xpAmount } },
        { upsert: true, new: true }
      );

      let { xp, level } = user;

      let xpFormula = client.config.xpFormula(level);
      if (xp >= xpFormula) {
        ++level;
        xp = 0;

        let msg = `Congratulations <@${message.author.id}>, you just leveled up to level ${level}. <:ztlove:1109689251781677068>`;

        const Rank = await RankLog.findOne({ Guild: message.guild.id });
        //* Give role
        if (Rank !== null) {
          if (Rank.roles !== null) {
            let roles = Rank.roles.find((r) => r.level === level);
            if (roles) {
              let role = roles.role;
              message.member.roles.add(role);
              msg =
                msg +
                `\nAnd you've got the <@&${role}> role! <:yaeheart:1109686395200602212>`;
            }
          }
          if (Rank.logChannel) {
            let notificationChannel = await client.channels.fetch(
              Rank.logChannel
            );

            const embed = new EmbedBuilder()
              .setTitle("🎉 Congratulations 🎉")
              .setThumbnail(message.author.avatarURL({ dynamic: true }))
              .addFields(
                {
                  name: "User:",
                  value: `${message.author.username}`,
                  inline: true,
                },
                { name: "Level:", value: `${level}`, inline: true },
                {
                  name: "Check the leaderboard using:",
                  value: `\`/rank leadearboard\``,
                }
              )
              .setColor(user.hexAccentColor || "Random");

            notificationChannel.send({ embeds: [embed] });
          }
          if (Rank.notification) {
            message.channel.send(msg);
          }
        } else {
          message.channel.send(msg);
        }

        await UserDB.updateOne({ Guild, User }, { level, xp });
      }
    } catch (err) {
      console.log(err);
    }

    cooldown.add(message.author.id);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cdRand * 1000);
  },
};
