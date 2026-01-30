require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// --- 1. IMPORT MODELS (Crucial for sequelize.sync) ---
const User = require('./models/User');
const AccessLog = require('./models/AccessLog');
const Book = require('./models/Book'); // 👈 Add this
const LibraryTransaction = require('./models/LibraryTransaction'); // 👈 Add this

// --- 2. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const nfcRoutes = require('./routes/nfcRoutes');
const libraryRoutes = require('./routes/libraryRoutes'); // 👈 Add this

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

// --- 3. REGISTER ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/library', libraryRoutes); // 👈 Add this

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // This will now create 'Books' and 'LibraryTransactions' automatically
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced & Library Tables Created');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Database Sync Error:', err);
    }
};

startServer();