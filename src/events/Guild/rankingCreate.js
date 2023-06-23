const { EmbedBuilder, Client, Message } = require("discord.js");
const UserDB = require("../../structures/schemas/user");
const RankLog = require("../../structures/schemas/rank");
const rank = require("../../structures/schemas/rank");

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
        Math.random() * (Math.pow(xpLevel, 2) / (xpLevel * 0.3)) +
          25 * (xpLevel / (xpLevel - 1))
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
        if (Rank.roles !== null) {
          let roles = Rank.roles.find((r) => {
            r.level = level;
          });
          if (roles) message.member.roles.add(roles.role);
          msg =
            msg +
            `\nAnd you've got the <@&${roles.role}> role! <:yaeheart:1109686395200602212>`;
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
