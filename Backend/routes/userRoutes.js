const express = require("express");
const User = require("../models/userModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

// User Registration
userRouter.get("/", async (req, res) => {
  res.send("User Registration");
});

module.exports = userRouter;
