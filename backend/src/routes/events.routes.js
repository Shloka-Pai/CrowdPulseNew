const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controllers");

// routes
router.post("/", eventController.createEvent);
router.get("/", eventController.getAllEvents);

module.exports = router;