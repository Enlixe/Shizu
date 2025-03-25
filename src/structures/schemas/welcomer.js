const { model, Schema } = require("mongoose");

module.exports = model(
  "Welcomer",
  new Schema({
    Guild: String,
    enabled: { type: Boolean, default: false },
    welcomeChannel: String,
    welcomeMsg: String,
    welcomeAttchment: String,
  })
);
