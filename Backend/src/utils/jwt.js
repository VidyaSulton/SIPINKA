const jwt = require('jsonwebtoken');

// generateToken berfungsi untuk menghasilkan jwt token dengan var payload yang berisi data user
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : '3d'});
}

// verifyToken berfungsi untuk memverifikasi jwt token yang diterima
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new error('Invalid token');
    }
}

module.exports = {generateToken, verifyToken};