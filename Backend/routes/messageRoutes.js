const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/chatModel");

const messageRouter = express.Router();

// Send message
messageRouter.post("/", async (req, res) => {
  try {
    const { content, groupId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      content,
      group: groupId,
    });

    const populateMessage = await Message.findById(message._id).populate(
      "sender",
      "username email"
    );
    res.status(201).json({ populateMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = messageRouter;
