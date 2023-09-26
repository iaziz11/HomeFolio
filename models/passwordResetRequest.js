const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordResetRequestSchema = new Schema({
  username: String,
  expires: Date,
});

module.exports = mongoose.model(
  "PasswordResetRequest",
  passwordResetRequestSchema
);
