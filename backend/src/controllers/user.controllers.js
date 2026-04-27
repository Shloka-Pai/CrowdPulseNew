const User = require("../models/user.model");

async function getVolunteers(req, res) {
    try {
        const volunteers = await User.find({ role: "volunteer" }).select("-password");
        res.status(200).json({ success: true, volunteers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    getVolunteers
};
