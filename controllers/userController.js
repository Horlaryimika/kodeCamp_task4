

const User = require('../models/userModel');
const AuthToken = require("../models/authTokenModel")
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const generateJWT = require("../routes/generatingJWT")
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

        const jwt = generateJWT({ id: user._id, email });
        res.status(201).send({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
              },token: jwt
        });
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

        const token = uuidv4();
        await AuthToken.create({
            userId: user._id,
            token,
            purpose: "password_reset",
          });
       
        res.status(201).send({
             message: 'Password reset link sent',
             token,
             userId: user._id
             });
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
        const userToken = await AuthToken.findOne({token});
       
        console.log("database password", userToken)
        if (!userToken) {
            res.status(400).send({ message: 'Invalid token' });
            return;
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        const userUpdate = await User.findByIdAndDelete(userToken.userId, {password: hashedNewPassword})

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error resetting password', error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
try{
    const userEmail = req.user.email;

    if (!userEmail) {
        return res.status(400).send({ message: 'User email is not provided' });
    }

    const userProfile = await User.findOne({ email: userEmail });
    if (!userProfile) {
        return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({
        fullName: userProfile.fullName,
        email: userProfile.email
    });    
    
} catch (error) {
    res.status(500).send({ message: 'Error fetching user profile', error: error.message });
}
}


  
    


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile
};

