const UserLogs = require("./userLogs.model");

exports.listLogs = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "user id needed"
            })
        }
        const logData = await UserLogs.find({ userId: userId }).sort({ time: -1 });
        res.status(200).json({
            success: true,
            data: logData
        })
    } catch (err) {
        next(err);
    }
}

exports.viewLogDetails = async (req, res, next) => {
    const { id } = req.body;
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "user id needed"
            })
        }
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "log id required"
            })
        }
        const logData = await UserLogs.findById(id);
        res.status(200).json({
            success: true,
            data: logData
        })
    } catch (err) {
        next(err)
    }
}