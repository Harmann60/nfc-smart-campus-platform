const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, rfid_uid } = req.body;

        // Check if user exists using 'user_email'
        let user = await User.findOne({ where: { user_email: email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user using exact DB column names
        user = await User.create({
            name: name,
            user_email: email,       // Map input 'email' to DB 'user_email'
            password_hash: hashedPassword, // Map input 'password' to DB 'password_hash'
            role: role,
            rfid_uid: rfid_uid
        });

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find using 'user_email'
        const user = await User.findOne({ where: { user_email: email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check password against 'password_hash'
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Payload uses 'user_id'
        const payload = {
            user: {
                id: user.user_id, // Important: use user_id here
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ... existing register and login code ...

exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users but hide the password hash!
        const users = await User.findAll({
            attributes: ['user_id', 'name', 'user_email', 'role', 'rfid_uid']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};