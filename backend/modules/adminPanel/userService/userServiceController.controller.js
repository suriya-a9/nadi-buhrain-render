const UserService = require('../../user/userService/userService.model');
const TechnicianUserService = require('./technicianUserService.model');
const formatDate = require('../../../utils/formatDate');
const logger = require('../../../logger');

exports.newUserServiceRequest = async (req, res, next) => {
    try {
        const newServiceList = await UserService.find({ serviceStatus: "submitted" })
            .populate("userId")
            .populate('serviceId')
            .populate('issuesId');
        const formattedList = newServiceList.map(service => {
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
        next(err);
    }
}

exports.updateServiceStatus = async (req, res, next) => {
    const { id, serviceStatus, reason } = req.body;
    try {
        const validStatuses = [
            "submitted",
            "accepted",
            "technicianAssigned",
            "inProgress",
            "paymentInProgress",
            "completed",
            "rejected"
        ];
        if (!validStatuses.includes(serviceStatus)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const update = {
            serviceStatus,
            [`statusTimestamps.${serviceStatus}`]: new Date()
        };

        if (serviceStatus === "rejected") {
            if (!reason) {
                return res.status(400).json({ message: "Reason required for rejection" });
            }
            update.reason = reason;
        }

        const updated = await UserService.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );
        res.status(200).json({
            message: "Status updated",
            data: updated
        });
    } catch (err) {
        console.log("Service error", err)
        next(err);
    }
};

exports.assignTechnician = async (req, res, next) => {
    const { serviceId, technicianId } = req.body;
    try {
        if (!serviceId || !technicianId) {
            return res.status(400).json({ message: "serviceId and technicianId are required" });
        }

        await UserService.findByIdAndUpdate(
            serviceId,
            { $set: { technicianId } }
        );

        const assignment = await TechnicianUserService.create({
            technicianId,
            userServiceId: serviceId,
            status: 'pending'
        });

        res.status(200).json({
            message: "Technician assignment created and technicianId added to service",
            data: assignment
        });
    } catch (err) {
        next(err);
    }
}

exports.technicianRespond = async (req, res, next) => {
    const { assignmentId, action, reason } = req.body;
    try {
        const assignment = await TechnicianUserService.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (action === 'accept') {
            assignment.status = 'accepted';
            await assignment.save();

            await UserService.findByIdAndUpdate(
                assignment.userServiceId,
                {
                    $set: {
                        serviceStatus: "technicianAssigned",
                        technicianAccepted: true,
                        technicianId: assignment.technicianId,
                        [`statusTimestamps.technicianAssigned`]: new Date()
                    }
                }
            );

            return res.status(200).json({ message: "Service accepted and updated" });
        } else if (action === 'reject') {
            if (!reason) {
                return res.status(400).json({ message: "Reason required for rejection" });
            }
            assignment.status = 'rejected';
            assignment.reason = reason;
            await assignment.save();

            await UserService.findByIdAndUpdate(
                assignment.userServiceId,
                { $set: { technicianId: null } }
            );

            return res.status(200).json({ message: "Service rejected", data: assignment });
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }
    } catch (err) {
        next(err);
    }
}

exports.acceptedServiceRequests = async (req, res, next) => {
    try {
        const newServiceList = await UserService.find({
            serviceStatus: { $nin: ["submitted", "rejected"] }
        })
            .populate("userId")
            .populate('serviceId')
            .populate('issuesId')
            .populate('technicianId');
        const formattedList = newServiceList.map(service => {
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
        next(err);
    }
}

exports.getTechnicianWorkStatus = async (req, res, next) => {
    try {
        const { userServiceId } = req.params;
        const record = await TechnicianUserService.findOne({ userServiceId });
        if (!record) return res.status(404).json({ message: "Not found" });
        res.json({
            status: record.status,
            notes: record.notes,
            media: record.media,
            usedParts: record.usedParts,
            workStartedAt: record.workStartedAt,
            workDuration: record.workDuration
        });
    } catch (err) {
        next(err);
    }
};