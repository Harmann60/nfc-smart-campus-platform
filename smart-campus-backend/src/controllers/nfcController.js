const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

// 1. Main Scan Function
exports.scanCard = async (req, res) => {

    const { rfid_uid, type = 'ATTENDANCE', amount = 0 } = req.body;

    if (!rfid_uid) return res.status(400).json({ error: 'RFID UID is required' });

    try {
        const user = await User.findOne({ where: { rfid_uid } });

        if (!user) {
            await AccessLog.create({ rfid_uid, scan_type: type, status: 'DENIED', user_name: 'Unknown' });
            return res.status(401).json({ message: 'Card not recognized', status: 'DENIED' });
        }

        // SCENARIO 1: ATTENDANCE
        if (type === 'ATTENDANCE') {
            await AccessLog.create({ rfid_uid, scan_type: 'ATTENDANCE', status: 'GRANTED', user_name: user.name });
            return res.json({ message: `Welcome, ${user.name}! Attendance Marked.`, balance: user.wallet_balance });
        }

        // SCENARIO 2: PAYMENT
        // SCENARIO 2: CANTEEN PAYMENT
if (type === 'CANTEEN_PAYMENT') {

    if (user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can make payments' });
    }

    if (user.wallet_balance >= amount) {
        user.wallet_balance -= amount;
        await user.save();

        await AccessLog.create({
            rfid_uid,
            scan_type: 'CANTEEN_PAYMENT',
            amount,
            status: 'GRANTED',
            user_name: user.name
        });

        return res.json({
            message: `Payment Successful! -₹${amount}`,
            new_balance: user.wallet_balance
        });

    } else {
        await AccessLog.create({
            rfid_uid,
            scan_type: 'CANTEEN_PAYMENT',
            amount,
            status: 'DENIED',
            user_name: user.name
        });

        return res.status(400).json({
            message: 'Insufficient Funds!',
            balance: user.wallet_balance
        });
    }
}


        // SCENARIO 3: LIBRARY
        if (type === 'LIBRARY') {
            await AccessLog.create({ rfid_uid, scan_type: 'LIBRARY', status: 'GRANTED', user_name: user.name });
            return res.json({ message: 'Library Access Granted', user: user.name });
        }

    } catch (error) {
        console.error('NFC Scan Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// 2. 💰 Top Up Function (This was missing or not exported)
exports.topUpWallet = async (req, res) => {
    const { rfid_uid, amount } = req.body;
    try {
        const user = await User.findOne({ where: { rfid_uid } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.wallet_balance += parseFloat(amount);
        await user.save();

        res.json({ message: `Recharge Successful! New Balance: $${user.wallet_balance}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await AccessLog.findAll({ order: [['timestamp', 'DESC']], limit: 50 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.identifyUser = async (req, res) => {
  try {
    const { rfid_uid } = req.body;
    const user = await User.findOne({ where: { rfid_uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found. Register card first." });
    }

    res.json(user); // Sends back name, role, etc.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};