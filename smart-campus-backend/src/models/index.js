const { sequelize } = require('../config/db');
const User = require('./User');
const LibraryTransaction = require('./LibraryTransaction'); // Import it just like User

// Define Associations here later (e.g., User hasOne Wallet)

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // 'alter' updates tables without deleting data
        console.log("✅ Models Synced");
    } catch (error) {
        console.log("❌ Sync Error:", error);
    }
};

// Add LibraryTransaction to the exports so libraryRoutes.js can see it
module.exports = { sequelize, syncDB, User, LibraryTransaction };