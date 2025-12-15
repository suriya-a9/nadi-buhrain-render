const UserAccount = require('./userAccount.model');
const FamilyMember = require('./familyMember.model');
const Account = require('../user/accountType/account.model');
const Otp = require('../otp/otp.model');
const Address = require('../address/address.model');
const config = require('../../config/default');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Notification = require('../adminPanel/notification/notification.model');

exports.startSignUp = async (req, res, next) => {
    const { accountTypeId } = req.body;
    try {
        if (!accountTypeId) {
            return res.status(400).json({
                message: "Account type must be selected"
            })
        }
        const newUser = await UserAccount.create({
            accountTypeId
        })
        res.status(201).json({
            message: "User created",
            userId: newUser._id
        })
    } catch (err) {
        next(err)
    }
}

exports.saveBasicInfo = async (req, res, next) => {
    const { userId, fullName, mobileNumber, email, gender, password } = req.body;
    try {
        const user = await UserAccount.findById(userId);
        const hashedPassword = await bcrypt.hash(password, 10)
        const addBasicInfo = await UserAccount.findByIdAndUpdate(user, {
            basicInfo: {
                fullName,
                mobileNumber,
                email,
                gender,
                password: hashedPassword
            },
            step: 2
        })
        res.status(200).json({
            message: "Basic info saved",
            data: addBasicInfo
        })
    } catch (err) {
        next(err)
    }
}

exports.saveAddress = async (req, res, next) => {
    const { userId, address } = req.body;
    try {
        if (!req.body.userId) {
            return res.status(400).json({
                message: "user id needed"
            })
        }
        await Address.create({
            userId,
            ...address
        });

        await UserAccount.findByIdAndUpdate(userId, { step: 3 });
        res.status(200).json({
            message: 'Address saved'
        })
    } catch (err) {
        next(err)
    }
}

exports.sendOtp = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!req.body.userId) {
            return res.status(400).json({
                message: "user id needed"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({
            userId,
            otp,
            expiresAt: Date.now() + 15 * 60 * 1000,
        })
        await UserAccount.findByIdAndUpdate(userId, { step: 4, status: "pending_otp" });

        res.json({ otp, message: "OTP sent" });
    } catch (err) {
        next(err);
    }
}

exports.verifyOtp = async (req, res, next) => {
    const { userId, otp } = req.body;
    try {
        if (!req.body.userId) {
            res.status(400).json({
                message: "user id needed"
            })
        }
        const record = await Otp.findOne({ userId }).sort({ createdAt: -1 });

        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        await Otp.deleteMany({ userId });
        await UserAccount.findByIdAndUpdate(userId, {
            isVerfied: true,
            step: 5
        })
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        next(err);
    }
}

exports.uploadIdProof = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!req.body.userId) {
            res.status(400).json({
                message: "user id needed"
            })
        }
        const fileNames = req.files.map(file => file.filename);
        await UserAccount.findByIdAndUpdate(userId, {
            idProofUrl: fileNames,
            step: 6
        });
        res.status(200).json({ message: "ID proof(s) uploaded" });
    } catch (err) {
        next(err);
    }
}

exports.addFamilyMember = async (req, res, next) => {
    const {
        userId,
        familyCount,
        password,
        fullName,
        relation,
        mobile,
        email,
        gender,
        address
    } = req.body;
    try {
        if (!userId) {
            return res.status(400).json({ message: "user id needed" });
        }
        const addressDoc = await Address.create({
            ...address
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const member = await FamilyMember.create({
            userId,
            fullName,
            relation,
            mobile,
            email,
            password: hashedPassword,
            gender,
            addressId: addressDoc._id
        });

        const user = await UserAccount.findById(userId);
        if (familyCount) {
            user.familyCount = familyCount;
        }
        user.familyMembersAdded += 1;
        await user.save();
        const isComplete = user.familyMembersAdded === user.familyCount;
        res.status(201).json({
            message: 'Family member added',
            allMemebersAdded: isComplete,
            data: member
        });
    } catch (err) {
        next(err);
    }
};

exports.termsAndConditionVerify = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!req.body.userId) {
            res.status(400).json({
                message: "user id needed"
            })
        }
        await UserAccount.findByIdAndUpdate(userId, {
            termsVerfied: true
        })
        res.status(200).json({
            message: "verified successfully"
        })
    } catch (err) {
        next(err)
    }
}

exports.completeSignUp = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const user = await UserAccount.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isVerfied) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        if (!user.idProofUrl) {
            return res.status(400).json({ message: "Upload ID proof first" });
        }
        const account = await Account.findById(user.accountTypeId);
        if (!account) {
            return res.status(400).json({ message: "Invalid account type" });
        }
        if (account.type === "FA") {
            if (user.familyMembersAdded !== user.familyCount) {
                return res.status(400).json({
                    message: "Please add all family members before completing signup"
                });
            }
        }
        if (!user.termsVerfied) {
            return res.status(400).json({ message: "need to accept terms and condition" });
        }
        const familyMembers = await FamilyMember.find({ userId });
        for (const member of familyMembers) {
            const existing = await UserAccount.findOne({ "basicInfo.email": member.email });
            if (existing) continue;
            const newFamilyUser = await UserAccount.create({
                accountTypeId: user.accountTypeId,
                basicInfo: {
                    fullName: member.fullName,
                    mobileNumber: member.mobile,
                    email: member.email,
                    gender: member.gender,
                    password: member.password
                },
                isVerfied: true,
                termsVerfied: true,
                status: "completed",
                singnUpCompleted: true,
                isFamilyMember: true,
                familyOwnerId: user._id,
                familyMemberRef: member._id
            });
            if (member.addressId) {
                await Address.findByIdAndUpdate(member.addressId, { userId: newFamilyUser._id }, { new: true });
            }
            await FamilyMember.findByIdAndUpdate(member._id, { linkedUserId: newFamilyUser._id }, { new: true });
        }
        user.status = "completed";
        user.singnUpCompleted = true;
        await user.save();
        const notification = await Notification.create({
            type: 'signup',
            message: `New user registered: ${user.basicInfo.fullName}`,
            userId: user._id,
            time: new Date(),
            read: false
        });
        const io = req.app.get('io');
        io.emit('notification', notification);
        res.status(200).json({
            message: 'user registered successfully',
            data: user
        })
    } catch (err) {
        next(err);
    }
}

exports.userprofile = async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            return res.status(400).json({
                message: 'user id needed'
            });
        }

        const userProfile = await UserAccount.findById(userId);
        const addresses = await Address.find({ userId });
        const familyMembers = await FamilyMember.find({ userId });

        if (!userProfile) {
            return res.status(404).json({
                message: 'user not found'
            });
        }

        res.status(200).json({
            data: userProfile,
            addresses,
            familyMembers
        });
    } catch (err) {
        next(err);
    }
}

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await UserAccount.findOne({ "basicInfo.email": email });
        if (!user) {
            return res.status(404).json({
                message: 'No account found with this email'
            });
        }
        const passwordCheck = await bcrypt.compare(password, user.basicInfo.password);
        if (!passwordCheck) {
            return res.status(401).json({
                message: 'Password mismatch'
            });
        }
        const token = jwt.sign(
            { id: user._id },
            config.jwt,
            { expiresIn: '30d' }
        );
        res.status(200).json({
            token: token
        });
    } catch (err) {
        next(err);
    }
}

exports.updateBasicInfoAndAddress = async (req, res, next) => {
    const { userId, basicInfo, address } = req.body;

    try {
        if (basicInfo) {
            const updateBasic = {};

            for (const key in basicInfo) {
                if (key === "password") {
                    updateBasic["basicInfo.password"] =
                        await bcrypt.hash(basicInfo.password, 10);
                } else {
                    updateBasic[`basicInfo.${key}`] = basicInfo[key];
                }
            }

            await UserAccount.findByIdAndUpdate(
                userId,
                { $set: updateBasic },
                { new: true }
            );
        }
        if (address) {
            const updateAddress = {};

            for (const key in address) {
                updateAddress[key] = address[key];
            }

            await Address.findOneAndUpdate(
                { userId },
                { $set: updateAddress },
                { new: true, upsert: true }
            );
        }

        res.status(200).json({
            message: "Basic info and address updated successfully"
        });

    } catch (err) {
        next(err);
    }
};