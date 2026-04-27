const express = require("express");
const { handleAIPush } = require("../controllers/alert.controllers");

const router = express.Router();

// Webhook endpoint for the AI service
router.post("/", handleAIPush);

module.exports = router;
