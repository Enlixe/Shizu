const { model, Schema } = require("mongoose");

module.exports = model(
  "Infraction",
  new Schema({
    Guild: String,
    User: String,
    Infractions: Array,
  })
);
