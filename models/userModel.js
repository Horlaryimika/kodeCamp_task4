
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    isEmailVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
