const Technician = require('./technician.model');
const jwt = require('jsonwebtoken');
const config = require('../../../config/default');
const bcrypt = require('bcrypt');

exports.registerTechnician = async (req, res, next) => {
    const { firstName, lastName, email, mobile, gender, password, role } = req.body;
    try {
        if (!req.user.id) {
            return res.status(404).josn({
                message: "user id required"
            })
        }
        const image = req.files?.image?.[0]?.filename;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (req.file) {

        }
        const registerData = await Technician.create({
            firstName,
            lastName,
            email,
            mobile,
            gender,
            role,
            image,
            password: hashedPassword
        })
        res.status(201).json({
            message: 'registered successfully',
            data: registerData
        })
    } catch (err) {
        next(err)
    }
}

exports.loginTechnician = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const emailData = await Technician.findOne({ email });
        if (!emailData) {
            return res.status(404).json({
                message: 'no account found with this email id'
            })
        }
        const passwordMatch = await bcrypt.compare(password, emailData.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "credentials mismatch"
            })
        }
        const token = jwt.sign(
            { id: emailData._id, role: emailData.role },
            config.jwt,
            { expiresIn: '30d' }
        )
        res.status(200).json({
            message: "Logged in successfully",
            token: token
        })
    } catch (err) {
        next(err)
    }
}

exports.updateTechnician = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        if (req.files?.image) {
            updateFields.image = req.files.image[0].filename;
        }
        await Technician.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        res.status(200).json({
            message: "Profile updated successfully"
        });
    } catch (err) {
        next(err);
    }
}

exports.deleteTechnician = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Technician.findByIdAndDelete(id);
        res.status(200).json({
            message: "Deleted successfully"
        })
    } catch (err) {
        next(err);
    }
}

exports.profile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const technicianData = await Technician.findById(userId);
        res.status(200).json({
            data: technicianData
        })
    } catch (err) {
        next(err);
    }
}

exports.technicianList = async (req, res, next) => {
    try {
        const technicianList = await Technician.find()
        .populate("role");
        res.status(200).json({
            data: technicianList
        })
    } catch (err) {
        next(err);
    }
}