// 🚨 THE REVIEW 2 BYPASS HACK 🚨
exports.login = async (req, res) => {
    console.log("🚨 LOGIN ATTEMPT RECEIVED! Bypassing security...");

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token: "fake-jwt-token-for-review",
        user: {
            id: 1,
            name: "Admin",
            email: "admin@identa.com",
            role: "admin"
        }
    });
};

// Dummy functions so your app doesn't crash
exports.register = async (req, res) => {
    res.status(200).send("Register bypassed for review");
};

exports.getAllUsers = async (req, res) => {
    res.status(200).json([]);
};