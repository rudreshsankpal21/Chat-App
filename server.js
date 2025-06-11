const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
