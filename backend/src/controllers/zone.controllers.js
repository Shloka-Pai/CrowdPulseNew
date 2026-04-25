const Zone = require("../models/zone.model");

// GET ALL ZONES
function getZones(req, res) {
  Zone.find(function (err, zones) {
    if (err) {
      return res.status(500).json({ message: "Error fetching zones" });
    }
    res.json(zones);
  });
}

module.exports = {
  getZones
};