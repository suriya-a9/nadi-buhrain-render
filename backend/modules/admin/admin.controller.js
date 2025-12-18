const Admin = require('./admin.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const bcrypt = require('bcrypt');

exports.adminRegister = async (req, res, next) => {
    const { name, email, password } = req.body;
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
            password: hashedPassword
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

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name },
            config.jwt,
            { expiresIn: "1d" }
        );

        res.status(200).json({ success: true, message: "Logged in", token });
    } catch (err) {
        next(err);
    }
};