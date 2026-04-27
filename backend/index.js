require('dotenv').config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const eventRoutes = require("./src/routes/events.routes"); 
const connectDB = require("./src/database/db");
const zoneRoutes = require("./src/routes/zone.routes");
const alertRoutes = require("./src/routes/alert.routes");
const webhookRoutes = require("./src/routes/webhook.routes");
const userRoutes = require("./src/routes/user.routes");

const app = express();
const server = http.createServer(app);

// setup socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Pass io to request object so it can be used in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected via WebSocket", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// middleware
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/zones", zoneRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/alerts/ai-webhook", webhookRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

// server start
server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});