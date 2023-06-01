const { EmbedBuilder, Client, Message } = require("discord.js");
const UserDB = require("../../structures/schemas/user");
const RankLog = require("../../structures/schemas/rankLog");

const cooldown = new Set();

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   * @returns
   */
  async execute(message, client) {
    const Guild = message.guild.id;
    const User = message.author.id;

    if (message.author.bot || !message.guild) return;
    if (cooldown.has(User)) return;

    let user;

    const cdRand = Math.floor(Math.random() * 45) + 1;

    try {
      const xpLevel = (await UserDB.findOne({ Guild, User })).level;
      const xpAmount = Math.floor(
        Math.random() * (Math.pow(xpLevel, 2) / (xpLevel * 0.3)) +
          25 * (xpLevel / (xpLevel - 1))
      );

      user = await UserDB.findOneAndUpdate(
        {
          Guild,
          User,
        },
        {
          Guild,
          User,
          $inc: { xp: xpAmount },
        },
        { upsert: true, new: true }
      );

      let { xp, level } = user;

      let xpFormula = client.config.xpFormula(level);
      if (xp >= xpFormula) {
        ++level;
        xp = 0;

        message.channel.send(
          `Congratulations <@${message.author.id}>, you just leveled up to level ${level}. <:ztlove:1109689251781677068>`
        );

        let notificationChannel = null;
        const logChannel = await RankLog.findOne({ Guild: message.guild.id });
        if (logChannel) {
          try {
            notificationChannel = await client.channels.fetch(
              logChannel.logChannel
            );
          } catch (err) {
            console.log(err);
          }
        }
        if (!notificationChannel) {
          notificationChannel = message.channel;
        }

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

        await UserDB.updateOne(
          {
            Guild,
            User,
          },
          {
            level,
            xp,
          }
        );
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
