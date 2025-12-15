const Points = require('./points.model');
const UserAccount = require('../../userAccount/userAccount.model');
const Request = require('../../requests/request.model');

exports.addPoints = async (req, res, next) => {
    const { points, accountType } = req.body;
    try {
        const pointsData = await Points.create({
            points,
            accountType
        })
        res.status(201).json({
            message: "points added",
            data: pointsData
        })
    } catch (err) {
        next(err);
    }
}

exports.listPoints = async (req, res, next) => {
    try {
        const pointsList = await Points.find();
        res.status(200).json({
            data: pointsList
        })
    } catch (err) {
        next(err)
    }
}

exports.updatePoints = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        await Points.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        )
        res.status(200).json({
            message: "Updated successfully"
        })
    } catch (err) {
        next(err)
    }
}

exports.requestPointsToFamily = async (req, res, next) => {
    const { familyId, points } = req.body;
    try {
        if (!req.user.id) {
            return res.status(400).json({
                message: 'User id is required'
            });
        }
        await Request.create({
            request: "Requesting points transfer",
            senderId: req.user.id,
            receiverId: familyId,
            points: points
        })
        res.status(201).json({
            message: "request sent"
        })
    } catch (err) {
        next(err);
    }
}

exports.transferPointsWithFamily = async (req, res, next) => {
    const { requestId, action, reason } = req.body;
    try {
        if (!requestId || !action) {
            return res.status(400).json({ message: 'requestId and action are required' });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.status !== "sent") {
            return res.status(400).json({ message: 'Request already processed' });
        }

        const sender = await UserAccount.findById(request.senderId);
        const receiver = await UserAccount.findById(request.receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        if (action === "accept") {
            const points = Number(request.points);
            if (!receiver.points || receiver.points < points) {
                return res.status(400).json({ message: 'Family member does not have enough points' });
            }
            receiver.points -= points;
            sender.points = Number(sender.points || 0) + points;

            await receiver.save();
            await sender.save();

            request.status = "accepted";
            await request.save();

            return res.status(200).json({ message: "Points transferred successfully" });
        } else if (action === "reject") {
            if (!reason) {
                return res.status(400).json({ message: 'Reason is required for rejection' });
            }
            request.status = "rejected";
            request.reason = reason;
            await request.save();
            return res.status(200).json({ message: "Request rejected" });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (err) {
        next(err);
    }
};

exports.requestList = async (req, res, next) => {
    try {
        if (!req.user.id) {
            return res.status(400).json({
                message: 'User id is required'
            });
        }
        const requestList = await Request.find({
            $or: [
                { senderId: req.user.id },
                { receiverId: req.user.id }
            ]
        });
        if (requestList.length === 0) {
            return res.status(200).json({
                message: "no request data"
            });
        }
        res.status(200).json({
            data: requestList
        })
    } catch (err) {
        next(err);
    }
}