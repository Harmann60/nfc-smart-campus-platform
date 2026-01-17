const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AccessLog = sequelize.define('AccessLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rfid_uid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 🔍 NEW: Scan Type
    scan_type: {
        type: DataTypes.ENUM('ATTENDANCE', 'PAYMENT', 'LIBRARY'),
        defaultValue: 'ATTENDANCE'
    },
    // 💸 NEW: Amount (for payments)
    amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    status: {
        type: DataTypes.ENUM('GRANTED', 'DENIED'),
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = AccessLog;