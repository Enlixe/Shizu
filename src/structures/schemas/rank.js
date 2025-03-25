const { model, Schema } = require("mongoose");

module.exports = model(
  "Rank",
  new Schema({
    Guild: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    notification: { type: Boolean, default: false },
    logChannel: { type: String, default: null },

    roles: { type: Array },
  })
);
