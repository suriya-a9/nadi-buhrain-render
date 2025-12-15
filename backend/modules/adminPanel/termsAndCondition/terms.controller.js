const Terms = require('./terms.model');

exports.addTerms = async (req, res, next) => {
    const { content } = req.body;
    try {
        const termsContent = await Terms.create({
            content
        })
        res.status(201).json({
            message: 'Terms and conditions added',
            data: termsContent,
        })
    } catch (err) {
        next(err);
    }
}

exports.listTerms = async (req, res, next) => {
    try {
        const termsList = await Terms.find();
        res.status(200).json({
            data: termsList
        })
    } catch (err) {
        next(err);
    }
}

exports.updateTerms = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        const termsUpdate = await Terms.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        )
        res.status(200).json({
            message: "Updated successfully",
            data: termsUpdate
        })
    } catch (err) {
        next(err);
    }
}

exports.deleteTerms = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Terms.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Deleted successfully'
        })
    } catch(err){
        next(err)
    }
}