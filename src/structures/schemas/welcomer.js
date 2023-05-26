const { model, Schema } = require("mongoose");

module.exports = model(
  "Welcomer",
  new Schema({
    Guild: String,
    Channel: String,
  })
);
