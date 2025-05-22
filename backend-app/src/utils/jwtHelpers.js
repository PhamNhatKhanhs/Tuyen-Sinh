const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

module.exports = { generateToken };