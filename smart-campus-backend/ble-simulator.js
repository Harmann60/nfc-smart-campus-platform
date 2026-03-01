// ble-simulator.js
const http = require('http');

const SERVER_URL = 'http://localhost:5000/api/nfc/telemetry';

const simulateScan = () => {
    const payload = JSON.stringify({
        gateway_id: "ESP32_ROOM_104",
        beacons: [
            { mac: "AA:BB:CC:11:22:33", student_name: "Jalaj Maheshwari", engagement_score: 88, rssi: -55 },
            { mac: "AA:BB:CC:44:55:66", student_name: "Harman Singh", engagement_score: 92, rssi: -62 },
            { mac: "AA:BB:CC:77:88:99", student_name: "Gauri", engagement_score: 95, rssi: -90 } // Weak signal, should be filtered out
        ]
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = http.request(SERVER_URL, options, (res) => {
        console.log(`Simulated Ping Sent -> Server Response: ${res.statusCode}`);
    });

    req.on('error', (e) => console.error(`Error: ${e.message}`));
    req.write(payload);
    req.end();
};

console.log("Starting BLE Hardware Simulator...");
simulateScan();
setInterval(simulateScan, 4000); // Ping every 4 seconds
