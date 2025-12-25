const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechnicalSkillSet'
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"]
    },
    image: {
        type: String
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: true,
    }
});

const Technician = mongoose.model('Technician', technicianSchema);
module.exports = Technician;