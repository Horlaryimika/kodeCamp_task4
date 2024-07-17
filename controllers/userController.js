

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//  email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Register user
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, 'secretkey', { expiresIn: '1h' });
        res.status(201).send({token});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const resetToken = uuidv4();
        user.resetToken = resetToken;
        await user.save();

        
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            html: "Hello! Click this link to reset your password http://localhost:3000/reset-password/" + resetToken
        });

        res.status(201).send({ message: 'Password reset link sent' });
    } catch (error) {
        res.status(500).send({ message: 'Error sending reset link', error: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
        console.log("sent token:", token)
        console.log("sent password:", newPassword)
    try {
        const user = await User.findOne({ resetToken: token });
       
        console.log("database password", user)
        if (!user) {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        user.resetToken = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error resetting password', error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).j({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, 'secretkey');
        const user = await User.findById(decoded.userId).select('fullName email');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile
};

