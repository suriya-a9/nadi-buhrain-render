const TechnicalSkillSet = require('./technicianSkillSet.model');

exports.addSkillSet = async (req, res, next) => {
    const { skill } = req.body;
    try {
        const skillsAdd = await TechnicalSkillSet.create({
            skill
        })
        res.status(201).json({
            message: 'created successfully',
            data: skillsAdd
        })
    } catch (err) {
        next(err)
    }
}

exports.listSkillSet = async (req, res, next) => {
    try {
        const skillsList = await TechnicalSkillSet.find();
        res.status(200).json({
            data: skillsList
        })
    } catch (err) {
        next(err);
    }
}

exports.updateSkillSet = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        await TechnicalSkillSet.findByIdAndUpdate(id, updateFields, { new: true });
        res.status(200).json({
            message: "updated successfully"
        })
    } catch (err) {
        next(err);
    }
}

exports.deleteSkillSet = async (req, res, next) => {
    const { id } = req.body;
    try {
        await TechnicalSkillSet.findByIdAndDelete(id);
        res.status(200).json({
            message: "deleted successfully"
        })
    } catch (err) {
        next(err);
    }
}