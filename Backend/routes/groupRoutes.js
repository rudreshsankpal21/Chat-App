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
groupRouter.get("/", protect, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "username email")
      .populate("members", "username email");

    res.status(200).json({ groups });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join group
groupRouter.post("/:groupId/join", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
    }

    // Check if user is already a member of the group
    if (group.members.includes(req.user._id)) {
      res
        .status(400)
        .json({ message: "User is already a member of the group" });
    }

    // Add user to group
    group.members.push(req.user._id);
    await group.save();
    res.status(200).json({ message: "User joined group successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to join group" });
  }
});

module.exports = groupRouter;
