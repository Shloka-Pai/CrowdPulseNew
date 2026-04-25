const Event = require("../models/event.model");

// CREATE EVENT
async function createEvent(req, res) {
  try {
    const { title, description, location, date, mapUrl } = req.body;

    const newEvent = new Event({
      title: title,
      description: description,
      location: location,
      date: date,
      mapUrl: mapUrl
    });

    const savedEvent = await newEvent.save(); 

    res.status(201).json(savedEvent);

  } catch (err) {
    res.status(500).json({ message: "Error creating event" });
  }
}

// GET ALL EVENTS
function getAllEvents(req, res) {
  Event.find(function(err, events) {
    if (err) {
      return res.status(500).json({ message: "Error fetching events" });
    }
    res.json(events);
  });
}

module.exports = {
  createEvent,
  getAllEvents
};