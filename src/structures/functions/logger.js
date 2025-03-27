const chalk = require("chalk");

module.exports = class Logger {
  constructor() {
    this.debugEnabled = false;
    this.timers = new Map(); // Store timers by name
  }

  /**
   * Formats the groups into a string.
   * @param {string[] | undefined} groups
   * @returns {string} Formatted groups string
   */
  formatGroups(groups = []) {
    return groups.length > 0 ? groups.map((v) => `[${v}]`).join(" ") : "";
  }

  /**
   * Gets the current timestamp in a readable format.
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    const now = new Date();
    // const date = now.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    const time = now.toLocaleTimeString("en-GB"); // Format: HH:mm:ss
    // return `${date} ${time}`;
    return `${time}`;
  }

  /**
   * Centralized method to write logs.
   * @param {string} level Log level (e.g., info, warn, error, debug)
   * @param {string} text The log message
   * @param {string[]} groups Optional groups
   * @param {Function} colorFn Chalk color function
   */
  writeLog(level, text, groups = [], colorFn = chalk.white) {
    const prefix = this.formatGroups(groups);
    const timestamp = this.getTimestamp();
    const levelTag = `[${level.toUpperCase()}]`;
    console.log(`${colorFn(`[${timestamp}] ${levelTag} ${prefix}`)} - ${text}`);
  }

  /**
   * Logs an informational message.
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  log(text, groups = []) {
    this.writeLog("i", text, groups, chalk.green);
  }

  /**
   * Logs an error message.
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  error(text, groups = []) {
    this.writeLog("e", text, groups, chalk.redBright);
  }

  /**
   * Logs a warning message.
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  warn(text, groups = []) {
    this.writeLog("w", text, groups, chalk.keyword("orange"));
  }

  /**
   * Logs a debug message (only if debug is enabled).
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  debug(text, groups = []) {
    if (this.debugEnabled) {
      this.writeLog("d", text, groups, chalk.blue);
    }
  }

  /**
   * Enables or disables debug logging.
   * @param {boolean} enabled
   */
  setDebug(enabled) {
    this.debugEnabled = enabled;
  }

  /**
   * Starts a timer with a given name, similar to console.time.
   * @param {string} label Timer label
   */
  time(label) {
    if (this.timers.has(label)) {
      this.warn(`Timer "${label}" is already running.`);
    } else {
      this.timers.set(label, Date.now());
      // this.log(`Timer "${label}" started.`);
    }
  }

  /**
   * Stops a timer with a given name and logs the duration, similar to console.timeEnd.
   * @param {string} label Timer label
   */
  timeEnd(label, groups = []) {
    if (!this.timers.has(label)) {
      this.error(`Timer "${label}" does not exist.`);
    } else {
      const startTime = this.timers.get(label);
      const duration = Date.now() - startTime;
      this.timers.delete(label);
      this.log(`Timer "${label}" ended. Duration: ${duration}ms.`, groups);
    }
  }
};
