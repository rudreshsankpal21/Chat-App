const express = require("express");
const Group = require("../models/groupModel");
const groupRouter = express.Router();

// Create a new group
groupRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      //   admin: req.user._id,
      //   members: [req.user._id],
    });

    const populateGroup = await Group.findById(group._id)
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populateGroup });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = groupRouter;
