const express = require("express");
const Group = require("../models/groupModel");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const groupRouter = express.Router();

// Create a new group
groupRouter.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    const populateGroup = await Group.findById(group._id)
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populateGroup });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all groups
groupRouter.get("/", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(200).json({ groups });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = groupRouter;
