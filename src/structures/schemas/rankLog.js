const { model, Schema } = require("mongoose");

module.exports = model(
  "RankLog",
  new Schema({
    Guild: {
      type: String,
      required: true,
    },
    logChannel: {
      type: String,
      required: true,
    },
  })
);
