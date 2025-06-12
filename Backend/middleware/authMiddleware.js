const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// middleware to protect route
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      //   verify user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //   get user from token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized , token not found" });
  }
};
module.exports = protect;
