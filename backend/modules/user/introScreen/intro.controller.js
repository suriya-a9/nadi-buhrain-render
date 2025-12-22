const Intro = require('./intro.model');
const UserLog = require("../../userLogs/userLogs.model");

exports.addIntro = async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content || !Array.isArray(content)) {
            return res.status(400).json({ message: "content must be an array of strings" });
        }
        const intro = await Intro.create({ content });
        await UserLog.create({
            userId: req.user.id,
            log: "Intro content added",
            status: "Created",
            logo: "/assets/intro.webp",
            time: new Date()
        });
        res.status(201).json({
            message: "Intro content added successfully",
            data: intro
        });

    } catch (err) {
        next(err);
    }
};

exports.getIntro = async (req, res, next) => {
    try {
        const intro = await Intro.findOne();

        if (!intro) {
            return res.status(404).json({ message: "Intro not found" });
        }

        res.status(200).json({
            data: intro
        });
    } catch (err) {
        next(err);
    }
};

exports.updateIntro = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        const updateData = await Intro.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        await UserLog.create({
            userId: req.user.id,
            log: "Intro content updated",
            status: "Updated",
            logo: "/assets/intro.webp",
            time: new Date()
        });
        res.status(200).json({
            message: 'updated',
            data: updateData
        })
    } catch (err) {
        next(err);
    }
}

exports.deleteIntro = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Intro.findByIdAndDelete(id);
        await UserLog.create({
            userId: req.user.id,
            log: "Intro content Deleted",
            status: "Deleted",
            logo: "/assets/intro.webp",
            time: new Date()
        });
        res.status(200).json({
            message: 'Intro deleted successfully'
        })
    } catch (err) {
        next(err);
    }
}