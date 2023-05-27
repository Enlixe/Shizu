const { loadFiles } = require("../functions/fileLoader");

async function loadCommands(bot) {
  console.time("[HANDLER] - Loaded Commands");

  await bot.commands.clear();
  await bot.subCommands.clear();

  const commands = new Array();
  let commandsArray = [];

  const files = await loadFiles("commands");

  for (const f of files) {
    try {
      const command = require(f);

      if (command.subCommand) bot.subCommands.set(command.subCommand, command);
      // else {
      else if (command.data) {
        bot.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        commands.push({ Command: command.data.name, Status: "🟢" });
      } else if (command.name) {
        bot.commands.set(command.name, command);
        commandsArray.push(command);
        commands.push({ Command: command.name, Status: "🟢" });
      }
      // }
    } catch (err) {
      commands.push({
        Command: f.split("/").pop().slice(0, -3),
        Status: "🔴",
      });
    }
  }
  await bot.application.commands.set(commandsArray);

  console.table(commands, ["Command", "Status"]);
  bot.logger.log("Loaded Commands!", ["HANDLER"]);
  console.timeEnd("[HANDLER] - Loaded Commands");
}

module.exports = { loadCommands };
