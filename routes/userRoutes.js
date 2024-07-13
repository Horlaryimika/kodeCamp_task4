

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const middleware = require("../middleware/authMiddleware")

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/profile', userController.getUserProfile);

module.exports = router;
