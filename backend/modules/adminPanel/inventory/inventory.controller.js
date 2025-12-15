const Inventory = require('./inventory.model');

exports.addInventory = async (req, res, next) => {
    const { productName, quantity, stock, price } = req.body;
    try {
        await Inventory.create({
            productName,
            quantity,
            price,
            stock: true
        });
        res.status(201).json({
            message: "Product created successfully"
        });
    } catch (err) {
        next(err);
    }
}

exports.listInventory = async (req, res, next) => {
    try {
        const productList = await Inventory.find({ stock: true });
        res.status(200).json({
            data: productList
        })
    } catch (err) {
        next(err)
    }
}

exports.updateInventory = async (req, res, next) => {
    const { id, ...updateFields } = req.body;
    try {
        await Inventory.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        )
        res.status(200).json({
            message: "updated successfully"
        })
    } catch (err) {
        next(err);
    }
}

exports.deleteInventory = async (req, res, next) => {
    const { id } = req.body;
    try {
        await Inventory.findByIdAndDelete(id);
        res.status(200).json({
            message: "Deleted Successfully"
        })
    } catch (err) {
        next(err);
    }
}

exports.stockUpdate = async (req, res, next) => {
    const { id, stock } = req.body;
    try {
        await Inventory.findByIdAndUpdate(
            id,
            { stock: stock },
            { new: true }
        );
        res.status(200).json({
            message: "Stock updated successfully"
        })
    } catch (err) {
        next(err);
    }
}