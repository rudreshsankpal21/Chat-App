require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socket = require("socket.io");
const socketIo = require("./socket.io");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize
socketIo(io);

// Routes
app.use("/api/users", userRouter);

// connect to db and start the server
mongoose
  .connect("mongo url")
  .then(() => {
    console.log("Connected to DB");
    server.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("Connection faied", err));
