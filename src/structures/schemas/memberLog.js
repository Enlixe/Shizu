const { model, Schema } = require("mongoose");

module.exports = model(
  "MemberLog",
  new Schema({
    Guild: String,
    logChannel: String,
    roleMember: String,
    roleBot: String,
  })
);
