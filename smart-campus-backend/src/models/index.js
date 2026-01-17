const sequelize = require('../config/db');
const User = require('./User');

// Define Associations here later (e.g., User hasOne Wallet)

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // 'alter' updates tables without deleting data
        console.log("✅ Models Synced");
    } catch (error) {
        console.log("❌ Sync Error:", error);
    }
};

module.exports = { sequelize, syncDB, User };
