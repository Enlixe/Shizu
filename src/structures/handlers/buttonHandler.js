const { loadFiles } = require("../functions/fileLoader");

async function loadButtons(bot) {
  console.time("[HANDLER] - Loaded Buttons");
  const buttons = new Array();

  bot.buttons = new Map();
  const files = await loadFiles("buttons");

  for (const f of files) {
    try {
      const btn = require(f);

      bot.buttons.set(btn.id, btn);

      buttons.push({ Buttons: btn.id, Status: "🟢" });
    } catch (err) {
      buttons.push({ Buttons: f.split("/").pop().slice(0, -3), Status: "🔴" });
    }
  }

  // const buttonsFolder = fs.readdirSync("./src/buttons");

  // for (const folder of buttonsFolder) {
  //   const buttonFiles = fs
  //     .readdirSync(`./src/buttons/${folder}`)
  //     .filter((file) => file.endsWith(".js"));

  //   for (const file of buttonFiles) {
  //     try {
  //       const buttonFile = require(`../../buttons/${folder}/${file}`);
  //       if (!buttonFile.id) return;

  //       buttons.push({ Buttons: buttonFile.id, Status: "🟢" });

  //       bot.buttons.set(buttonFile.id, buttonFile);
  //     } catch (err) {
  //       buttons.push({
  //         Buttons: file,
  //         Status: "🔴",
  //       });
  //     }
  //   }
  // }

  console.table(buttons, ["Buttons", "Status"]);
  bot.logger.log("Loaded Buttons!", ["HANDLER"]);
  console.timeEnd("[HANDLER] - Loaded Buttons");
}
module.exports = { loadButtons };
