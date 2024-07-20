const mongoose = require("mongoose");

const authTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    }

},{ timestamps: true });

const AuthToken = mongoose.model("AuthToken", authTokenSchema);
module.exports = AuthToken;