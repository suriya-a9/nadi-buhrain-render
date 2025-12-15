const mongoose = require('mongoose')
const UserService = require('./userService.model');
const formatDate = require('../../../utils/formatDate');

exports.createRequest = async (req, res, next) => {
    const { serviceId, issuesId, feedback, scheduleService, immediateAssistance, otherIssue } = req.body;
    try {
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
            userId: req.user.id,
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
        })
        res.status(201).json({
            message: "Service created successfully",
            data: requestCreate
        })
    } catch (err) {
        next(err)
    }
}
exports.userServiceList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(404).json({
                message: "user id needed"
            })
        }
        const userServicesList = await UserService.find({ userId: userId })
            .populate('serviceId')
            .populate('issuesId')
            .populate('technicianId')
        const formattedList = userServicesList.map(service => {
            const formattedTimestamps = {};
            Object.entries(service.statusTimestamps).forEach(([key, value]) => {
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
        })
    } catch (err) {
        next(err)
    }
}