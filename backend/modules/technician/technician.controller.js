const Technician = require('../adminPanel/technician/technician.model');
const Notification = require('../adminPanel/notification/notification.model');
const Inventory = require('../adminPanel/inventory/inventory.model');
const UserService = require('../user/userService/userService.model');
const Address = require('../address/address.model');
const TechnicianUserService = require('../adminPanel/userService/technicianUserService.model');
const SpareParts = require("../adminPanel/spareParts/spareParts.model");
const UserAccount = require('../userAccount/userAccount.model');

exports.assignedServices = async (req, res, next) => {
    try {
        const technicianId = req.user.id;
        if (!technicianId) {
            return res.status(400).json({ message: "Technician ID required" });
        }

        const assignments = await TechnicianUserService.find({
            technicianId,
            status: 'pending'
        });
        if (!assignments.length) {
            return res.status(200).json({
                message: "no assigned request yet",
                data: []
            });
        }
        const userServiceIds = assignments.map(a => a.userServiceId);

        const services = await UserService.find({ _id: { $in: userServiceIds } })
            .populate({
                path: 'userId',
                select: 'basicInfo'
            })
            .populate('serviceId')
            .populate('issuesId');

        const userIds = services.map(s => s.userId._id);
        const addresses = await Address.find({ userId: { $in: userIds } });

        const servicesWithAddress = services.map(service => {
            const address = addresses.find(a => a.userId.toString() === service.userId._id.toString());
            const assignment = assignments.find(a => a.userServiceId.toString() === service._id.toString());
            return {
                ...service.toObject(),
                address: address || null,
                assignmentStatus: assignment?.status,
                assignmentReason: assignment?.reason || null
            };
        });

        res.status(200).json({
            data: servicesWithAddress
        });
    } catch (err) {
        next(err);
    }
}

exports.servicesList = async (req, res, next) => {
    try {
        const technicianId = req.user.id;
        if (!technicianId) {
            return res.status(400).json({ message: "Technician ID required" });
        }

        const assignments = await TechnicianUserService.find({
            technicianId,
            status: 'accepted'
        });
        if (!assignments.length) {
            return res.status(200).json({
                message: "no requests yet",
                data: []
            });
        }
        const userServiceIds = assignments.map(a => a.userServiceId);

        const services = await UserService.find({ _id: { $in: userServiceIds } })
            .populate({
                path: 'userId',
                select: 'basicInfo'
            })
            .populate('serviceId')
            .populate('issuesId');

        const userIds = services.map(s => s.userId._id);
        const addresses = await Address.find({ userId: { $in: userIds } });

        const servicesWithAddress = services.map(service => {
            const address = addresses.find(a => a.userId.toString() === service.userId._id.toString());
            const assignment = assignments.find(a => a.userServiceId.toString() === service._id.toString());
            return {
                ...service.toObject(),
                address: address || null,
                assignmentStatus: assignment?.status,
                assignmentReason: assignment?.reason || null
            };
        });

        res.status(200).json({
            data: servicesWithAddress
        });
    } catch (err) {
        next(err);
    }
}

// single and bulk material request apis in adminpanel materail request folder for technician - don't forget that bullshit

exports.inventory = async (req, res, next) => {
    try {
        if (!req.user.id) {
            return res.status(404).json({
                message: "user id required"
            })
        }
        const inventoryList = await SpareParts.find({
            technicianId: req.user.id
        }).populate("productId");
        if (!inventoryList || inventoryList.length === 0) {
            return res.status(200).json({
                message: "no products in inventory"
            });
        }
        res.status(200).json({
            message: "inventory list retrieved",
            data: inventoryList
        })
    } catch (err) {
        next(err);
    }
}

exports.startWork = async (req, res, next) => {
    try {
        const { userServiceId } = req.body;
        const technicianId = req.user.id;

        if (!technicianId) {
            return res.status(404).json({ message: "user id not found" });
        }
        if (!userServiceId) {
            return res.status(400).json({ message: "userServiceId is required" });
        }

        const userService = await UserService.findByIdAndUpdate(
            userServiceId,
            {
                serviceStatus: "inProgress",
                "statusTimestamps.inProgress": new Date(),
                workStartedAt: new Date()
            },
            { new: true }
        );
        if (!userService) {
            return res.status(404).json({ message: "UserService not found" });
        }

        const techUserService = await TechnicianUserService.findOneAndUpdate(
            { technicianId, userServiceId },
            { status: "in-progress", workStartedAt: new Date() },
            { new: true }
        );
        if (!techUserService) {
            return res.status(404).json({ message: "TechnicianUserService not found" });
        }

        res.status(200).json({
            message: "Work started, statuses updated",
            userService,
            techUserService
        });
    } catch (err) {
        next(err);
    }
};

exports.onHoldService = async (req, res, next) => {
    const { userServiceId } = req.body;
    try {
        const technicianId = req.user.id;
        if (!technicianId) {
            return res.status(400).json({
                message: 'user id not found'
            })
        }
        if (!userServiceId) {
            return res.status(400).json({
                message: 'service id required'
            })
        }
        const userService = await UserService.findById(userServiceId);
        if (userService.workStartedAt) {
            const now = new Date();
            const elapsed = Math.floor((now - userService.workStartedAt) / 1000);
            userService.workDuration = (userService.workDuration || 0) + elapsed;
            userService.workStartedAt = null;
            await userService.save();
        }
        await TechnicianUserService.findOneAndUpdate(
            { technicianId, userServiceId },
            { status: "oh-hold" },
            { new: true }
        );
        res.status(200).json({
            message: "service on hold"
        })
    } catch (err) {
        next(err);
    }
}

exports.updateServiceStatus = async (req, res, next) => {
    try {
        const { userServiceId, notes } = req.body;
        const technicianId = req.user.id;
        const mediaFiles = req.files ? req.files.map(file => file.filename) : [];

        if (!technicianId) {
            return res.status(404).json({ message: "user id not found" });
        }
        if (!userServiceId) {
            return res.status(400).json({ message: "userServiceId is required" });
        }
        const techUserService = await TechnicianUserService.findOne({ technicianId, userServiceId });
        if (!techUserService) {
            return res.status(404).json({ message: "TechnicianUserService not found" });
        }
        let updatedFields = {
            notes: notes || "",
            $push: { media: { $each: mediaFiles } },
            status: "completed"
        };
        if (techUserService.workStartedAt) {
            const now = new Date();
            const elapsed = Math.floor((now - techUserService.workStartedAt) / 1000);
            updatedFields.workDuration = (techUserService.workDuration || 0) + elapsed;
            updatedFields.workStartedAt = null;
        }

        const updatedTechUserService = await TechnicianUserService.findOneAndUpdate(
            { technicianId, userServiceId },
            updatedFields,
            { new: true }
        );

        // await UserService.findByIdAndUpdate(
        //     userServiceId,
        //     { serviceStatus: "completed", "statusTimestamps.completed": new Date() }
        // );

        res.status(200).json({
            message: "Service completed, notes and media saved",
            techUserService: updatedTechUserService
        });
    } catch (err) {
        next(err);
    }
}

exports.paymentRaise = async (req, res, next) => {
    try {
        const { userServiceId, sparePartsUsed, selectedSpareParts } = req.body;
        const technicianId = req.user.id;

        if (!technicianId) {
            return res.status(404).json({ message: "Technician id not found" });
        }
        if (!userServiceId) {
            return res.status(400).json({ message: "userServiceId is required" });
        }

        let totalSparePartsCost = 0;
        let usedPartsDetails = [];

        if (sparePartsUsed && Array.isArray(selectedSpareParts) && selectedSpareParts.length > 0) {
            const productIds = selectedSpareParts.map(p => p.productId);
            const spareParts = await SpareParts.find({
                technicianId,
                productId: { $in: productIds }
            });
            const inventoryProducts = await Inventory.find({
                _id: { $in: productIds }
            });

            for (const selected of selectedSpareParts) {
                const part = spareParts.find(sp => sp.productId.toString() === selected.productId);
                const inventory = inventoryProducts.find(inv => inv._id.toString() === selected.productId);
                const usedCount = parseInt(selected.count, 10) || 0;
                if (!part) {
                    return res.status(400).json({ message: `Spare part not found for product ${selected.productId}` });
                }
                const availableCount = parseInt(part.count, 10) || 0;
                if (usedCount > availableCount) {
                    return res.status(400).json({ message: `Not enough stock for product ${inventory?.productName || selected.productId}` });
                }
                part.count = (availableCount - usedCount).toString();
                await part.save();

                const price = inventory?.price || 0;
                totalSparePartsCost += usedCount * price;
                usedPartsDetails.push({
                    productId: selected.productId,
                    productName: inventory?.productName || "",
                    count: usedCount,
                    price,
                    total: usedCount * price
                });
            }
        }

        await TechnicianUserService.findOneAndUpdate(
            { technicianId, userServiceId },
            { status: "completed", usedParts: usedPartsDetails }
        );

        const userService = await UserService.findByIdAndUpdate(
            userServiceId,
            { serviceStatus: "paymentInProgress", "statusTimestamps.paymentInProgress": new Date() },
            { new: true }
        );

        const notificationMsg = sparePartsUsed
            ? `Payment raised for service ${userService.serviceRequestID}. Spare parts used: ${usedPartsDetails.map(p => `${p.productName} x${p.count}`).join(', ')}. Total: ₹${totalSparePartsCost}`
            : `Payment raised for service ${userService.serviceRequestID}. No spare parts used.`;

        await Notification.create({
            message: notificationMsg,
            type: "payment_raised",
            time: new Date()
        });

        res.status(200).json({
            message: "Payment raised, notifications sent",
            totalSparePartsCost,
            usedPartsDetails
        });
    } catch (err) {
        next(err);
    }
};