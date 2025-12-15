const Road = require("./road.model");

exports.addRoad = async (req, res, next) => {
  const { name } = req.body;
  try {
    const roadData = await Road.create({
      name,
    });
    res.status(201).json({
      message: "Created successfully",
      data: roadData,
    });
  } catch (err) {
    next(err);
  }
};

exports.listRoad = async (req, res, next) => {
  try {
    const roadList = await Road.find();
    res.status(200).json({
      data: roadList,
    });
  } catch (err) {
    next(err);
  }
};


exports.updateRoad = async (req, res, next) => {
  const { id, ...updateFields } = req.body;
  try {
    const updateRoad = await Road.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    )
    res.status(200).json({
      message: 'updated successfully',
      data: updateRoad
    })
  } catch (err) {
    next(err);
  }
}

exports.deleteRoad = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Road.findByIdAndDelete(id);
    res.status(200).json({
      message: 'Deleted successfully'
    })
  } catch (err) {
    next(err)
  }
}