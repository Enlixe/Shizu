const { Client, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} bot
   */
  execute(bot) {
    bot.logger.log(`Client is Running!`, ["Bot", "Ready"]);
    bot.logger.log(`Logged in as ${bot.user.tag} (${bot.user.id})`, ["Bot", "Ready"]);

    const getActivities = () => [
      `Playing with ${bot.guilds.cache.size} lovely servers 💖`,
      `Serving ${bot.users.cache.size} amazing users 🌟`,
      `Spreading joy and code ✨`,
      `Type /help to be friends! 🐾`,
      `Listening to your commands 🎶`,
      `Making the world cuter, one server at a time 🐱`,
    ];

    let activityIndex = 0;

    const updateActivity = () => {
      try {
        // Dynamically fetch activities to ensure updated values
        const activities = getActivities();
        const activity = activities[activityIndex];

        bot.user.setActivity(activity, { type: ActivityType.Custom, state: `${activity}`});

        bot.logger.log(`Activity updated: ${activity}`, ["Bot", "Ready"]);
        activityIndex = (activityIndex + 1) % activities.length;
      } catch (err) {
        bot.logger.error(`Failed to set activity: ${err.message}`, [
          "Bot",
          "ERROR",
        ]);
      }
    };

    updateActivity();
    setInterval(updateActivity, 4 * 60 * 1000); // Update every 4 minutes
  },
};