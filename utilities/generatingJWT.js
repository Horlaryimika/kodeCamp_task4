const jwt = require('jsonwebtoken');
const generateJWT = (userData) => {
    try {
        const token = jwt.sign(userData, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        console.log("Error generating JWT:", error.message);
    }
}
module.exports = generateJWT;