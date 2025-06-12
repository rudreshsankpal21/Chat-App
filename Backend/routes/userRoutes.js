const express = require("express");
const User = require("../models/userModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

// User Registration route
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ username, email, password });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = userRouter;
