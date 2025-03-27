const { loadFiles } = require("../functions/fileLoader");
const path = require("path");

function validateCommand(command) {
  if (command.subCommand || command.data || command.name) {
    return true;
  }
  throw new Error("Invalid command structure");
}

async function processCommand(file, bot, commands, commandsArray) {
  try {
    delete require.cache[require.resolve(file)];
    const command = require(file);
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
  } catch (err) {
    const fileName = path.basename(file);
    bot.logger.log(`Error loading command '${fileName}': ${err.message}`, ["COMMAND"]);
    commands.push({
      Command: fileName.replace(".js", ""),
      Status: "🔴",
    });
  }
}

async function loadCommands(bot) {
  console.time("[HANDLER] - Loaded Commands");

  await bot.commands.clear();
  await bot.subCommands.clear();

  const commands = [];
  const commandsArray = [];

  const files = await loadFiles("commands");

  try {
    await Promise.all(files.map((f) => processCommand(f, bot, commands, commandsArray)));
  } catch (err) {
    bot.logger.log(`Unexpected error during command loading: ${err.message}`, ["HANDLER"]);
  }

  await bot.application.commands.set(commandsArray);

  console.table(commands, ["Command", "Status"]);
  bot.logger.log(`Successfully loaded ${commands.filter(c => c.Status === "🟢").length} commands.`, ["HANDLER"]);
  bot.logger.log(`Failed to load ${commands.filter(c => c.Status === "🔴").length} commands.`, ["HANDLER"]);
  console.timeEnd("[HANDLER] - Loaded Commands");
}

module.exports = { loadCommands };