const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    request: {
        type: String
    },
    senderId: {
        type: String
    },
    receiverId: {
        type: String
    },
    points: {
        type: String
    },
    status: {
        type: String,
        enum: ["sent", "accepted", "rejected"],
        default: "sent"
    },
    reason: {
        type: String
    }
}, { timestamps: true });

const Request = mongoose.model('Reques', requestSchema);
module.exports = Request;