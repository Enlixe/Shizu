const { model, Schema } = require("mongoose");

module.exports = model(
  "Welcomer",
  new Schema({
    Guild: String,
    welcomeChannel: String,
    welcomeMsg: String,
    welcomeAttchment: String,
  })
);
