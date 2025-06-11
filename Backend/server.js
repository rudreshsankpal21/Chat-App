const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// routes
app.use("/register", userRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
