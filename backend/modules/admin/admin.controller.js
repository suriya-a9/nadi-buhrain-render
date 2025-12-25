const Admin = require('./admin.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const bcrypt = require('bcrypt');
const UserLog = require("../userLogs/userLogs.model");

exports.adminRegister = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
        }
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: "All details required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminData = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: adminData
        });
    } catch (err) {
        next(err);
    }
};

exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        const admin = await Admin.findOne({ email }).populate('role');
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const permissions = admin.role?.permissions || [];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name, role: admin.role.name, permissions },
            config.jwt,
            { expiresIn: "1d" }
        );
        await UserLog.create({
            userId: admin._id,
            log: "Signed In",
            status: "Logged",
            logo: "/assets/user-login-logo.webp",
            time: new Date()
        });
        res.status(200).json({ success: true, message: "Logged in", token, role: admin.role.name, permissions });
    } catch (err) {
        next(err);
    }
};

exports.listAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find().select("-password").populate("role", "name");
        res.json({ success: true, data: admins });
    } catch (err) {
        next(err);
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, password } = req.body;

        const updateData = { name, role };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.json({ success: true, message: "Admin updated", data: updatedAdmin });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        next(err);
    }
};