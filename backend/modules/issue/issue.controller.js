const Issue = require('./issue.model');

exports.addIssue = async (req, res, next) => {
    const { serviceId, issue } = req.body;
    try {
        const addIssue = await Issue.create({
            serviceId,
            issue
        })
        res.status(201).json({
            message: 'Issue created',
            data: addIssue
        })
    } catch (err) {
        next(err)
    }
}

exports.listIssue = async (req, res, next) => {
    try {
        const issueList = await Issue.find();
        res.status(200).json({
            data: issueList
        })
    } catch (err) {
        next(err)
    }
}

exports.updateIssue = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        await Issue.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        )
        res.status(200).json({
            message: "updated successfully"
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteIssue = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Issue.findByIdAndDelete(id);
        res.status(200).json({
            message: 'deleted successfully'
        })
    } catch (err) {
        next(err)
    }
}