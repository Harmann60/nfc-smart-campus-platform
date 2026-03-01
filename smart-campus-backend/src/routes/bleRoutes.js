const express = require('express');
const router = express.Router();
// const User = require('../models/User'); // We will use your actual Sequelize model later!

// Temporary mock database mapped to MAC addresses for the prototype
const STUDENTS_DB = {
    "AA:BB:CC:11:22:33": { student_name: "Jalaj Maheshwari", engagement_score: 88 },
    "AA:BB:CC:44:55:66": { student_name: "Harman Singh", engagement_score: 92 },
    "AA:BB:CC:77:88:99": { student_name: "Gauri", engagement_score: 95 }
};

// In-Memory Store for Live Proximity Detection
// Format: { "MAC_ADDRESS": { mac, student_name, last_seen, rssi } }
let activeClassroom = {};

// ---------------------------------------------------------
// 1. IOT INGESTION ENDPOINT (ESP32 Gateway POSTs here)
// POST /api/ble/telemetry
// ---------------------------------------------------------
router.post('/telemetry', async (req, res) => {
    const { gateway_id, beacons } = req.body;
    const currentTime = Date.now();

    if (!beacons || !Array.isArray(beacons)) {
        return res.status(400).json({ error: "Invalid payload format" });
    }

    beacons.forEach(beacon => {
        // ANTI-PROXY LOGIC: Only register if signal is stronger than -80 dBm
        if (beacon.rssi > -80) {
            
            // For now, we use the Mock DB. Later, we will use: 
            // const user = await User.findOne({ where: { ble_mac: beacon.mac } });
            const student = STUDENTS_DB[beacon.mac];

            if (student) {
                activeClassroom[beacon.mac] = {
                    mac: beacon.mac,
                    last_seen: currentTime,
                    rssi: beacon.rssi,
                    student_name: student.student_name,
                    engagement_score: student.engagement_score
                };
            }
        }
    });

    // Send a quick success response back to the ESP32
    res.json({ status: "success", processed: beacons.length });
});

// ---------------------------------------------------------
// 2. FRONTEND POLLING ENDPOINT (React GETs data from here)
// GET /api/ble/live-radar
// ---------------------------------------------------------
router.get('/live-radar', (req, res) => {
    const currentTime = Date.now();
    let liveStudents = [];

    // Clean up students who haven't been detected in the last 60 seconds
    for (const mac in activeClassroom) {
        const data = activeClassroom[mac];
        
        if (currentTime - data.last_seen < 60000) {
            liveStudents.push(data); // Still in the room
        } else {
            delete activeClassroom[mac]; // Left the room, remove from session
        }
    }

    // Send the array of active students to the React Dashboard
    res.json(liveStudents);
});

module.exports = router;
