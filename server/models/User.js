const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  planet: String,
  email: { type: String, unique: true },
  active: Boolean,
  rank: String,
  minor: Boolean,
});

module.exports = mongoose.model("User", userSchema);
