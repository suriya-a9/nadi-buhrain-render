const Admin = require('./admin.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const bcrypt = require('bcrypt');

exports.adminRegister = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminData = await Admin.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            message: 'Admin registered',
            data: adminData
        })
    } catch (err) {
        next(err);
    }
}

exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            res.status(404).json({
                message: 'Email not found',
            })
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(404).json({
                message: 'Password not match',
            })
        }
        const token = jwt.sign(
            { id: admin._id, email: admin.email, name: admin.name },
            config.jwt,
            { expiresIn: '1d' }
        )
        res.status(200).json({
            message: 'Logged in',
            token
        })
    } catch (err) {
        next(err)
    }
}