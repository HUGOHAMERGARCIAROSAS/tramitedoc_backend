const jwt = require('jsonwebtoken');


const generarJWT = ( uid) => {
    return jwt.sign({uid}, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = generarJWT;