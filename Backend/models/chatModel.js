const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Chat Schema
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      trim: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "Group",
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
