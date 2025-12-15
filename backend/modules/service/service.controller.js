const Service = require('./service.model');

exports.createService = async (req, res, next) => {
    const { name } = req.body;
    try {
        const serviceImage = req.files?.serviceImage?.[0]?.filename;
        const serviceLogo = req.files?.serviceLogo?.[0]?.filename;
        await Service.create({
            name,
            serviceImage,
            serviceLogo
        });
        res.status(201).json({
            message: 'Service created'
        })
    } catch (err) {
        next(err);
    }
}

exports.updateService = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        if (req.files?.serviceImage) {
            updateFields.serviceImage = req.files.serviceImage[0].filename;
        }
        if (req.files?.serviceLogo) {
            updateFields.serviceLogo = req.files.serviceLogo[0].filename;
        }
        await Service.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );
        res.status(200).json({
            message: "Service updated successfully"
        });
    } catch (err) {
        next(err);
    }
};

exports.listService = async (req, res, next) => {
    try {
        const serviceList = await Service.find();
        res.status(200).json({
            data: serviceList
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteService = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Service.findByIdAndDelete(id);
        res.status(200).json({
            message: "Deleted successfully"
        })
    } catch (err) {
        next(err)
    }
}