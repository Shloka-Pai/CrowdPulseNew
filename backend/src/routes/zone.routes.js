const express = require("express");
const router = express.Router();

const zoneController = require("../controllers/zone.controllers");

// GET /zones
router.get("/", zoneController.getZones);

module.exports = router;