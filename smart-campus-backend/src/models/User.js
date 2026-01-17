const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'student'
    },
    // 💰 NEW: Wallet Balance
    wallet_balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    rfid_uid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

module.exports = User;