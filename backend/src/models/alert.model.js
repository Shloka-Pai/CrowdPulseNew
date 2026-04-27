const mongoose = require("mongoose");

const alertschema = new mongoose.Schema({
    eventId: String,
    zoneId: String,
    assignedTo: String,
    severity: String,
    isResolved: { type: Boolean, default: false },
    action: String,
    type: { type: String, enum: ['AI_DETECTION', 'SOS_MANUAL'], default: 'AI_DETECTION' },
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Alert = mongoose.model("Alert", alertschema);
module.exports = Alert;