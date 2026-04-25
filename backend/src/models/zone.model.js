// src/models/zone.model.js

const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({ 
  name: String,
  type: String,
  coordinates: Number,
  capacity: Number,
});

const Zone = mongoose.model("Zone", zoneSchema);

module.exports = Zone;