const Alert = require("../models/alert.model");

async function generateAlert(req, res) {
    const { eventId, zoneId, severity, message, action, type } = req.body;
    try {
        const newAlert = new Alert({
            eventId, 
            zoneId, 
            severity,
            message,
            action,
            type: type || 'SOS_MANUAL',
            isResolved: false
        });
        await newAlert.save();

        // Emit to all connected clients
        const io = req.app.get("io");
        if (io) {
            io.emit("new-alert", newAlert);
        }

        res.status(201).json({ success: true, alert: newAlert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function handleAIPush(req, res) {
    const aiData = req.body;
    // aiData contains { zone_analysis, global_status, recommended_action }
    
    console.log("\n🚨 [BACKEND] Received New AI Alert Payload!");
    console.log(`- Global Status: ${aiData.global_status}`);
    console.log(`- Action: ${aiData.recommended_action}\n`);
    
    try {
        const alerts = [];
        
        // Only generate DB alerts for HIGH/CRITICAL zones to avoid spam
        if (aiData.zone_analysis) {
            for (const [zoneName, data] of Object.entries(aiData.zone_analysis)) {
                if (data.severity === 'HIGH' || data.severity === 'CRITICAL') {
                    const newAlert = new Alert({
                        zoneId: zoneName,
                        severity: data.severity,
                        message: `AI detected ${data.flow_pattern} flow with ${data.density_level} density.`,
                        action: data.reason,
                        type: 'AI_DETECTION',
                        isResolved: false
                    });
                    await newAlert.save();
                    alerts.push(newAlert);
                }
            }
        }

        const io = req.app.get("io");
        if (io) {
            // 1. Broadcast the general AI state (for dashboard UI updates)
            io.emit("ai-crowd-update", aiData);
            
            // 2. Broadcast any new critical alerts that were generated
            if (alerts.length > 0) {
                io.emit("new-alert", alerts);
            }
        }

        res.status(200).json({ success: true, generatedAlerts: alerts.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAlerts(req, res) {
    try {
        const alerts = await Alert.find({ isResolved: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

async function resolveAlert(req, res) {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true });
        const io = req.app.get("io");
        if (io) {
            io.emit("resolved-alert", alert._id);
        }
        res.status(200).json({ success: true, alert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    generateAlert,
    handleAIPush,
    getAlerts,
    resolveAlert
};
