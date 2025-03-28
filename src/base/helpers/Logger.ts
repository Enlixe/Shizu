import chalk from "chalk";

function formatGroups(groups: string[]): string {
    return groups.length > 0 ? groups.map((v) => `[${v}]`).join(" ") : "";
}

function getTimestamp(): string {
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB"); // Format: HH:mm:ss
    return `${time}`;
}

function writeLog(level: string, text: string, groups: string[], colorFn: (text: string) => string = chalk.white) {
    const prefix = formatGroups(groups);
    const timestamp = getTimestamp();
    const levelTag = `[${level.toUpperCase()}]`;
    console.log(`${colorFn(`[${timestamp}] ${levelTag} ${prefix}`)} - ${text}`);
}

export default class Logger {
    public log(text: string, groups: string[]) {
        writeLog("i", text, groups, chalk.green);
    }

    public error(text: string, groups: string[] = []): void {
        writeLog("e", text, groups, chalk.redBright);
    }

    public warn(text: string, groups: string[] = []): void {
        writeLog("w", text, groups, chalk.keyword("orange"));
    }
}