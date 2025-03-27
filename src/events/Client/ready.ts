import { ShizuClient, Event } from "../../ShizuClient";
import { ActivityType } from "discord.js";

const readyEvent: Event = {
  name: "ready",
  once: true,
  execute(bot: ShizuClient): void {
    bot.logger.log(`Client is Running!`, ["Bot", "Ready"]);
    bot.logger.log(`Logged in as ${bot.user?.tag} (${bot.user?.id})`, ["Bot", "Ready"]);

    const getActivities = (): string[] => [
      `Playing with ${bot.guilds.cache.size} lovely servers 💖`,
      `Serving ${bot.users.cache.size} amazing users 🌟`,
      `Spreading joy and code ✨`,
      `Type /help to be friends! 🐾`,
      `Listening to your commands 🎶`,
      `Making the world cuter, one server at a time 🐱`,
    ];

    let activityIndex = 0;

    const updateActivity = (): void => {
      try {
        // Dynamically fetch activities to ensure updated values
        const activities = getActivities();
        const activity = activities[activityIndex];

        bot.user?.setActivity(activity, { type: ActivityType.Custom, state: activity });

        bot.logger.debug(`Activity updated: ${activity}`, ["Bot", "Ready"]);
        activityIndex = (activityIndex + 1) % activities.length;
      } catch (err) {
        if (err instanceof Error) {
          bot.logger.error(`Failed to set activity: ${err.message}`, ["Bot", "ERROR"]);
        } else {
          bot.logger.error(`Failed to set activity: ${String(err)}`, ["Bot", "ERROR"]);
        }
      }
    };

    updateActivity();
    setInterval(updateActivity, 4 * 60 * 1000); // Update every 4 minutes
  },
};

export = readyEvent;