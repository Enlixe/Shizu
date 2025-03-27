const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} bot
   */
  execute(bot) {
    bot.logger.log(`Client is Running!`, ["CLIENT"]);
    bot.logger.log(`Logged in as ${bot.user.tag} (${bot.user.id})`, ["CLIENT"]);

    const activities = [
      `with ${bot.guilds.cache.size} lovely servers 💖`,
      `serving ${bot.users.cache.size} amazing users 🌟`,
      `spreading joy and code ✨`,
      `type /help to be friends! 🐾`,
      `listening to your commands 🎶`,
      `making the world cuter, one server at a time 🐱`,
    ];

    let activityIndex = 0;

    const updateActivity = () => {
      try {
        // Rotate through the activities
        const activity = activities[activityIndex]
          .replace("${bot.guilds.cache.size}", bot.guilds.cache.size)
          .replace("${bot.users.cache.size}", bot.users.cache.size);

        bot.user.setActivity(activity, { type: "PLAYING" });

        bot.logger.log(`Activity updated: ${activity}`, ["CLIENT"]);
        activityIndex = (activityIndex + 1) % activities.length;
      } catch (err) {
        bot.logger.error(`Failed to set activity: ${err.message}`, [
          "CLIENT",
          "ERROR",
        ]);
      }
    };

    updateActivity();
    setInterval(updateActivity, 4 * 60 * 1000);
  },
};
