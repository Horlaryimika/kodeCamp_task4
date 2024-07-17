
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
     },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: { 
        type: Boolean,
         default: false 
    },
    authToken: {
        type: String
    },
    authPurpose: {
        type: String
    },
    resetToken: {
        type: String
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
