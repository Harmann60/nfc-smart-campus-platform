const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rfid_uid: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Nullable because Admins might not have cards
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'student', 'teacher', 'canteen', 'librarian'),
        defaultValue: 'student'
    }
});

module.exports = User;
