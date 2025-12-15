const mongoose = require('mongoose');

const technicianUserService = new mongoose.Schema({
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technician"
    },
    userServiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserService"
    },
    workStartedAt: {
        type: Date,
        default: null
    },
    workDuration: {
        type: Number,
        default: 0
    },
    adminNotified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in-progress', 'on-hold', 'rejected', 'completed'],
        default: 'pending'
    },
    reason: {
        type: String
    },
    notes: {
        type: String,
        default: ""
    },
    media: {
        type: [String],
        default: []
    },
    usedParts: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
            productName: String,
            count: Number,
            price: Number,
            total: Number
        }
    ],
})

const TechnicianUserService = mongoose.model("TechnicianUserService", technicianUserService);
module.exports = TechnicianUserService;