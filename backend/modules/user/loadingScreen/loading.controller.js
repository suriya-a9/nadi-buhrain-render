const Loading = require("./loading.model");
const fs = require("fs");
const path = require("path");
const UserLog = require("../../userLogs/userLogs.model");

exports.uploadLoadingScreen = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const saved = await Loading.create({ image: req.file.filename });
    await UserLog.create({
      userId: req.user.id,
      log: "Loading content added",
      status: "Created",
      logo: "/assets/loading.webp",
      time: new Date()
    });
    return res.json({
      message: "File uploaded successfully",
      file: req.file.filename,
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

exports.loadingScreen = async (req, res, next) => {
  try {
    const loadingData = await Loading.find();

    if (!loadingData.length) {
      return res.status(200).json({ data: null });
    }

    res.status(200).json({
      data: loadingData[0]
    });
  } catch (err) {
    next(err);
  }
};

const uploadFolder = path.join(process.cwd(), "uploads");

exports.updateLoadingScreen = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const loadingItem = await Loading.findById(id);

    if (!loadingItem) {
      return res.status(404).json({ message: "Loading screen entry not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No new image uploaded" });
    }

    const oldImage = loadingItem.image;
    const newImage = req.file.filename;

    if (oldImage) {
      const oldImagePath = path.join(uploadFolder, oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    loadingItem.image = newImage;
    await loadingItem.save();
    await UserLog.create({
      userId: req.user.id,
      log: "Loading content Updated",
      status: "Updated",
      logo: "/assets/loading.webp",
      time: new Date()
    });
    res.status(200).json({
      message: "Loading screen updated successfully",
      data: loadingItem,
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteLoadingScreen = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Loading.findByIdAndDelete(id);
    await UserLog.create({
      userId: req.user.id,
      log: "Loading content Deleted",
      status: "Deleted",
      logo: "/assets/loading.webp",
      time: new Date()
    });
    res.status(200).json({
      message: "Deleted successfully"
    })
  } catch (err) {
    next(err)
  }
}