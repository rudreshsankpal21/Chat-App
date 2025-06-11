const express = require("express");
const User = require("../models/userModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

// User Registration
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
