const express = require("express");
const { db } = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const companyRouter = require("./routes/company.routes");
const JobModel = require("./models/job.model");

const app = express();
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

// Create HTTP server & WebSocket server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome, Backend of JobPortal!");
});

app.use(userRouter, companyRouter);

// WebSocket connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Real-time like event
  socket.on("likeJob", async ({ jobId, userId }) => {
    try {
      const job = await JobModel.findById(jobId);
      if (!job) {
        return socket.emit("error", { message: "Job not found" });
      }

      // Toggle like
      const index = job.likes.indexOf(userId);
      if (index !== -1) {
        job.likes.splice(index, 1); // Remove like
      } else {
        job.likes.push(userId); // Add like
      }

      await job.save();
      io.emit("jobUpdated", job); // Broadcast update to all users
    } catch (error) {
      console.error("Error liking job:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  // Real-time comment event
  socket.on("commentJob", async ({ jobId, userId, text }) => {
    try {
      if (!text) {
        return socket.emit("error", { message: "Comment text is required" });
      }

      const job = await JobModel.findById(jobId);
      if (!job) {
        return socket.emit("error", { message: "Job not found" });
      }

      job.comments.push({ userId, text, createdAt: new Date() });
      await job.save();
      io.emit("jobUpdated", job); // Broadcast update
    } catch (error) {
      console.error("Error commenting on job:", error);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(process.env.PORT || 5000, () => {
  db();
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
