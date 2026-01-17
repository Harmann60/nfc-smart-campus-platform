require('dotenv').config(); // 👈 ADD THIS LINE AT THE TOP
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const nfcRoutes = require('./routes/nfcRoutes'); // 👈 This was likely missing or broken

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/nfc', nfcRoutes);   // 👈 This connects the NFC logic to the server

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Sync Database (using 'alter' to update table structures if needed)
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Database Sync Error:', err);
    }
};

startServer();