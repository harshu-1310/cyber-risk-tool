const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: String,
  ip: String,
  location: String, // 👈 ADD THIS
  loginTime: Date,
  isSuspicious: Boolean
});

module.exports = mongoose.model("Log", logSchema);