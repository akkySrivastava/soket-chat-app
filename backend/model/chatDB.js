const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  text: String,
  userId: String,
  name: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("chatData", chatSchema);
