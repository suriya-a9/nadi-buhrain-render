const express = require("express");
const { uploadLoadingScreen,
    loadingScreen,
    updateLoadingScreen,
    deleteLoadingScreen,
    listAllLoadingScreens,
    setLoadingScreenEnabled } = require("./loading.controller");
const auth = require("../../../middleware/authMiddleware");
const upload = require("./../../../middleware/fileUpload");

const router = express.Router();

router.post("/upload", auth, upload.single("image"), uploadLoadingScreen);
router.get("/loading-screen", loadingScreen);
router.post("/update", auth, upload.single("image"), updateLoadingScreen);
router.post("/delete", auth, deleteLoadingScreen);
router.get("/all", auth, listAllLoadingScreens);
router.post("/set-enabled", auth, setLoadingScreenEnabled);

module.exports = router;