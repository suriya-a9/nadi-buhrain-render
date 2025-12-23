const mongoose = require('mongoose')
const UserService = require('./userService.model');
const formatDate = require('../../../utils/formatDate');
const UserAccount = require("../../userAccount/userAccount.model");
const Notification = require('../../../modules/adminPanel/notification/notification.model');
const UserLog = require("../../userLogs/userLogs.model");

exports.createRequest = async (req, res, next) => {
    const { serviceId, issuesId, feedback, scheduleService, immediateAssistance, otherIssue } = req.body;
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                message: "user id needed"
            })
        }
        const user = await UserAccount.findById(userId);
        if (user.accountVerification !== "verified") {
            return res.status(400).json({
                message: 'Your account is not verified yet. Kindly wait till your account get verified'
            })
        }
        const fileNames = req.files ? req.files.map(file => file.filename) : [];
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: "Invalid serviceId" });
        }
        if (!issuesId && !otherIssue) {
            return res.status(400).json({ message: "Either issuesId or otherIssue is required" });
        }
        if (issuesId && !mongoose.Types.ObjectId.isValid(issuesId)) {
            return res.status(400).json({ message: "Invalid issuesId" });
        }

        const requestCreate = await UserService.create({
            userId: userId,
            serviceId,
            issuesId: issuesId ? issuesId : null,
            otherIssue: otherIssue ? otherIssue : null,
            media: fileNames,
            feedback,
            scheduleService: scheduleService ? new Date(scheduleService) : null,
            immediateAssistance: !!immediateAssistance,
            serviceStatus: "submitted",
            statusTimestamps: {
                submitted: new Date(),
                processing: null,
                technicianAssigned: null,
                inProgress: null,
                paymentInProgress: null,
                completed: null
            }
        });
        const notification = await Notification.create({
            type: 'service_request',
            message: `New service request submitted by ${user.basicInfo.fullName}`,
            userId: user._id,
            time: new Date(),
            read: false
        });
        const io = req.app.get('io');
        io.emit('notification', notification);
        await UserLog.create({
            userId: req.user.id,
            log: `New service requested submitted`,
            status: "Submitted",
            logo: "/assets/service request.webp",
            time: new Date()
        });
        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: requestCreate
        })
    } catch (err) {
        next(err)
    }
}
// exports.userServiceList = async (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         if (!userId) {
//             return res.status(404).json({
//                 message: "user id needed"
//             });
//         }

//         const page = parseInt(req.query.page) || 10;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const totalCount = await UserService.countDocuments({ userId });

//         const userServicesList = await UserService.find({ userId })
//             .populate('serviceId')
//             .populate('issuesId')
//             .populate('technicianId')
//             .skip(skip)
//             .limit(limit);

//         const formattedList = userServicesList.map(service => {
//             const formattedTimestamps = {};
//             Object.entries(service.statusTimestamps || {}).forEach(([key, value]) => {
//                 formattedTimestamps[key] = formatDate(value, true);
//             });
//             return {
//                 ...service.toObject(),
//                 statusTimestamps: formattedTimestamps,
//                 scheduleService: formatDate(service.scheduleService, true),
//                 createdAt: formatDate(service.createdAt, true),
//                 updatedAt: formatDate(service.updatedAt, true)
//             };
//         });

//         res.status(200).json({
//             data: formattedList,
//             pagination: {
//                 totalItems: totalCount,
//                 currentPage: page,
//                 totalPages: Math.ceil(totalCount / limit),
//                 pageSize: limit
//             }
//         });
//     } catch (err) {
//         next(err);
//     }
// };
exports.userServiceList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(404).json({
                message: "user id needed"
            });
        }

        const userServicesList = await UserService.find({ userId })
            .populate('serviceId')
            .populate('issuesId')
            .populate('technicianId');

        const formattedList = userServicesList.map(service => {
            const formattedTimestamps = {};
            Object.entries(service.statusTimestamps || {}).forEach(([key, value]) => {
                formattedTimestamps[key] = formatDate(value, true);
            });
            return {
                ...service.toObject(),
                statusTimestamps: formattedTimestamps,
                scheduleService: formatDate(service.scheduleService, true),
                createdAt: formatDate(service.createdAt, true),
                updatedAt: formatDate(service.updatedAt, true)
            };
        });

        res.status(200).json({
            data: formattedList
        });
    } catch (err) {
        next(err);
    }
};