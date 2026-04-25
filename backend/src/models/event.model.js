// src/models/event.model.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({ 
  title: String,
  description: String,
  location: String,
  date: Date,
  mapUrl: String
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;