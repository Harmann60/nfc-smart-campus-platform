const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, rfid_uid } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User in DB
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            rfid_uid
        });

        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 2. Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 3. Generate Token (JWT)
        const payload = { 
            user: { 
                id: user.id, 
                role: user.role 
            } 
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }, // Token valid for 1 day
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
