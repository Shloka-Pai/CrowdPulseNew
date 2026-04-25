require('dotenv').config();

const express = require("express");
const authRoutes = require("./src/routes/auth.routes");
const eventRoutes = require("./src/routes/events.routes"); 
const connectDB = require("./src/database/db");
const zoneRoutes = require("./src/routes/zone.routes");

const app = express();

// middleware
app.use(express.json());

// DB connection
connectDB();

// routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/zones", zoneRoutes);

// server start
app.listen(process.env.PORT, function() {
  console.log("Server running on port 5000");
});