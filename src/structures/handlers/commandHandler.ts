import { loadFiles } from "../functions/fileLoader";
import path from "path";
import { ShizuClient, Command } from "../../ShizuClient"; // Adjust the import path as necessary

function validateCommand(command: Command): void {
  if (command.subCommand || command.data || command.name) {
    return;
  }
  throw new Error("Invalid command structure");
}

async function processCommand(file: string, bot: ShizuClient, commands: Array<{ Command: string; Status: string }>, commandsArray: any[]): Promise<void> {
  try {
    delete require.cache[require.resolve(file)];
    const command: Command = require(file);
    validateCommand(command);

    if (command.subCommand) {
      bot.subCommands.set(command.subCommand, command);
    } else if (command.data) {
      bot.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
      commands.push({ Command: command.data.name, Status: "🟢" });
    } else if (command.name) {
      bot.commands.set(command.name, command);
      commandsArray.push(command);
      commands.push({ Command: command.name, Status: "🟢" });
    }
  } catch (err: Error | any) {
    const fileName = path.basename(file);
    bot.logger.log(`Error loading command '${fileName}': ${err.message}`, ["COMMAND"]);
    commands.push({
      Command: fileName.replace(".ts", ""),
      Status: "🔴",
    });
  }
}

async function loadCommands(bot: ShizuClient): Promise<void> {
  if (bot.config.debug) bot.logger.time("Load");

  await bot.commands.clear();
  await bot.subCommands.clear();

  const commands: Array<{ Command: string; Status: string }> = [];
  const commandsArray: any[] = [];

  const files = await loadFiles("commands");

  try {
    await Promise.all(
      files.map((f) => processCommand(f, bot, commands, commandsArray))
    );
  } catch (err: Error | any) {
    bot.logger.log(`Unexpected error during command loading: ${err.message}`, ["Handler", "Commands"]);
  }

  // const devGuild = bot.config.dev_guild; // Set your development guild ID in an environment variable
  // if (devGuild !== null) {
  //   await bot.guilds.cache.get(devGuild)?.commands.set(commandsArray);
  //   bot.logger.log(`Commands uploaded to development guild: ${devGuild}`, ["Handler", "Commands"]);
  // }
  // await bot.application.commands.set(commandsArray);
  bot.logger.log(`Commands uploaded globally.`, ["Handler", "Commands"]);

  const successCount = commands.filter((c) => c.Status === "🟢").length;
  const failureCount = commands.filter((c) => c.Status === "🔴").length;

  if (bot.config.table) console.table(commands, ["Command", "Status"]);
  bot.logger.log(`Successfully loaded ${successCount} commands.`, ["Handler", "Commands"]);
  bot.logger.log(`Failed to load ${failureCount} commands.`, ["Handler", "Commands"]);

  if (bot.config.debug) bot.logger.timeEnd("Load", ["Handler", "Commands"]);
}

export { loadCommands };