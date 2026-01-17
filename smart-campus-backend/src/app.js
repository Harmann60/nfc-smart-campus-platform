const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
    // Tells Jalaj's DB to create tables based on your Models
    // Remove "force: false" in production, use it only for dev to avoid data loss
    await sequelize.sync({ alter: true }); 
    console.log('✅ Database Synced');
});
