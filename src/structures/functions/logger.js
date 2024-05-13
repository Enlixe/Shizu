const chalk = require("chalk");

module.exports = class {
  /**
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  log(text, groups) {
    if (groups) {
      const mapped = groups.map((v) => `[${v}]`);
      console.log(`${chalk.green(mapped.join(" "))} - ${text}`);
    } else {
      console.log(text);
    }
  }

  /**
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  error(text, groups) {
    if (groups) {
      const mapped = groups.map((v) => `[${v}]`);
      console.error(`${chalk.redBright(mapped.join(" "))} - ${text}`);
    } else {
      console.error(text);
    }
  }

  /**
   * @param {string} text
   * @param {string[] | undefined} groups
   */
  warn(text, groups) {
    if (groups) {
      const mapped = groups.map((v) => `[${v}]`);
      console.error(`${chalk.keyword('orange')(mapped.join(" "))} - ${text}`);
    } else {
      console.error(text);
    }
  }
};
