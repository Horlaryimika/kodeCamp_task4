

const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format
    if (!token) {
        return res.status(401).send({ message: 'Access denied. Token not provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded;
        console.log('Decoded user:', decoded); // Log the decoded information for debugging
        next();
    } catch (ex) {
        console.error('Token verification failed:', ex); // Log the error for debugging
        res.status(400).send({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;



