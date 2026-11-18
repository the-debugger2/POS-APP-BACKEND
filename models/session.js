const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    token: {
        type: String,
        required: true
    },

    deviceId: {
        type: String
    },

    revoked: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Session",
    SessionSchema
);