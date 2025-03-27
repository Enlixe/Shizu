import chalk from "chalk";

export default class Logger {
  private debugEnabled: boolean;
  private timers: Map<string, number>; // Store timers by name

  constructor() {
    this.debugEnabled = false;
    this.timers = new Map<string, number>();
  }

  /**
   * Formats the groups into a string.
   * @param {string[]} groups
   * @returns {string} Formatted groups string
   */
  private formatGroups(groups: string[] = []): string {
    return groups.length > 0 ? groups.map((v) => `[${v}]`).join(" ") : "";
  }

  /**
   * Gets the current timestamp in a readable format.
   * @returns {string} Formatted timestamp
   */
  private getTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB"); // Format: HH:mm:ss
    return `${time}`;
  }

  /**
   * Centralized method to write logs.
   * @param {string} level Log level (e.g., info, warn, error, debug)
   * @param {string} text The log message
   * @param {string[]} groups Optional groups
   * @param {Function} colorFn Chalk color function
   */
  private writeLog(level: string, text: string, groups: string[] = [], colorFn: (text: string) => string = chalk.white): void {
    const prefix = this.formatGroups(groups);
    const timestamp = this.getTimestamp();
    const levelTag = `[${level.toUpperCase()}]`;
    console.log(`${colorFn(`[${timestamp}] ${levelTag} ${prefix}`)} - ${text}`);
  }

  /**
   * Logs an informational message.
   * @param {string} text
   * @param {string[]} groups
   */
  public log(text: string, groups: string[] = []): void {
    this.writeLog("i", text, groups, chalk.green);
  }

  /**
   * Logs an error message.
   * @param {string} text
   * @param {string[]} groups
   */
  public error(text: string, groups: string[] = []): void {
    this.writeLog("e", text, groups, chalk.redBright);
  }

  /**
   * Logs a warning message.
   * @param {string} text
   * @param {string[]} groups
   */
  public warn(text: string, groups: string[] = []): void {
    this.writeLog("w", text, groups, chalk.keyword("orange"));
  }

  /**
   * Logs a debug message (only if debug is enabled).
   * @param {string} text
   * @param {string[]} groups
   */
  public debug(text: string, groups: string[] = []): void {
    if (this.debugEnabled) {
      this.writeLog("d", text, groups, chalk.blue);
    }
  }

  /**
   * Enables or disables debug logging.
   * @param {boolean} enabled
   */
  public setDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  /**
   * Starts a timer with a given name, similar to console.time.
   * @param {string} label Timer label
   */
  public time(label: string): void {
    if (this.timers.has(label)) {
      this.warn(`Timer "${label}" is already running.`);
    } else {
      this.timers.set(label, Date.now());
    }
  }

  /**
   * Stops a timer with a given name and logs the duration, similar to console.timeEnd.
   * @param {string} label Timer label
   * @param {string[]} groups Optional groups
   */
  public timeEnd(label: string, groups: string[] = []): void {
    if (!this.timers.has(label)) {
      this.error(`Timer "${label}" does not exist.`);
    } else {
      const startTime = this.timers.get(label)!; // Use non-null assertion since we checked existence
      const duration = Date.now() - startTime;
      this.timers.delete(label);
      this.log(`Timer "${label}" ended. Duration: ${duration}ms.`, groups);
    }
  }
}