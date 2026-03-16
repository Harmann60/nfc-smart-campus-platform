const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

// In-Memory Store for Live Proximity Detection (Keeps the UI fast)
let activeClassroom = {};

// ---------------------------------------------------------
// 1. IOT INGESTION ENDPOINT (ESP32 Gateway POSTs here)
// ---------------------------------------------------------
router.post('/telemetry', async (req, res) => {
    const { gateway_id, beacons } = req.body;
    const currentTime = Date.now();

    if (!beacons || !Array.isArray(beacons)) {
        return res.status(400).json({ error: "Invalid payload format" });
    }

    for (const beacon of beacons) {
        if (beacon.rssi > -80) {
            try {
                const student = await User.findOne({ where: { ble_mac: beacon.mac } });

                if (student) {
                    activeClassroom[beacon.mac] = {
                        mac: beacon.mac,
                        last_seen: currentTime,
                        rssi: beacon.rssi,
                        student_name: student.name,
                        engagement_score: student.engagement_score
                    };
                }
            } catch (err) {
                console.error("Database query failed:", err);
            }
        }
    }

    res.json({ status: "success", processed: beacons.length });
});

// ---------------------------------------------------------
// 2. FRONTEND POLLING ENDPOINT (React GETs data from here)
// ---------------------------------------------------------
router.get('/live-radar', (req, res) => {
    const currentTime = Date.now();
    let liveStudents = [];

    for (const mac in activeClassroom) {
        const data = activeClassroom[mac];

        if (currentTime - data.last_seen < 60000) {
            liveStudents.push(data);
        } else {
            delete activeClassroom[mac];
        }
    }

    res.json(liveStudents);
});

// ---------------------------------------------------------
// 3. SEED DEMO DATA (Run ONCE from browser)
// ---------------------------------------------------------
router.get('/seed-demo-data', async (req, res) => {
    try {
        const bcrypt = require('bcryptjs'); // Assumes you are using bcryptjs
        const pass = await bcrypt.hash("password123", 10);

        // 1. Create the Admin user for you to log in
        await User.findOrCreate({
            where: { email: "admin@identa.com" },
            defaults: {
                name: "Admin",
                password: pass,
                role: "admin"
            }
        });

        // 2. Create the Demo Students
        await User.findOrCreate({
            where: { ble_mac: "AA:BB:CC:11:22:33" },
            defaults: { name: "Jalaj Maheshwari", role: "student", engagement_score: 88 }
        });
        await User.findOrCreate({
            where: { ble_mac: "AA:BB:CC:44:55:66" },
            defaults: { name: "Harman Jassal", role: "student", engagement_score: 92 } // 👈 Fixed your name!
        });
        await User.findOrCreate({
            where: { ble_mac: "AA:BB:CC:77:88:99" },
            defaults: { name: "Gauri", role: "student", engagement_score: 95 }
        });

        res.send("✅ Database seeded! You can now log in with email: admin@identa.com | Password: password123");
    } catch (err) {
        res.status(500).send("❌ Error seeding DB: " + err.message);
    }
});

module.exports = router;