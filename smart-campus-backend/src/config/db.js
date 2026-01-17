const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../smart_campus.db'),
    logging: false,
    // 👇 ADD THIS SECTION
    dialectOptions: {
        // This tells SQLite: "Don't check if role_id exists in another table, just save the data!"
        foreignKeys: false
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        // Force foreign keys off for this connection just to be sure
        await sequelize.query("PRAGMA foreign_keys = OFF;");
        console.log('✅ Connected to SQLite Database (Foreign Keys Disabled)!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
};

module.exports = { sequelize, connectDB };