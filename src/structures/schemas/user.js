const { model, Schema } = require("mongoose");

module.exports = model(
  "User",
  new Schema({
    Guild: { type: String, require: true },
    User: { type: String, require: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  })
);
