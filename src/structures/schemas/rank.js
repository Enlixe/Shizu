const { model, Schema } = require("mongoose");

module.exports = model(
  "Rank",
  new Schema({
    Guild: {
      type: String,
      required: true,
    },
    logChannel: { type: String },
    roles: { type: Array },
    notification: { type: Boolean, default: true },
  })
);
