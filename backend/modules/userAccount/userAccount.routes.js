const express = require("express");
const router = express.Router();
const controller = require("./userAccount.controller");
const upload = require("../../middleware/fileUpload");

router.post("/", controller.startSignUp);
router.post("/basic-info", controller.saveBasicInfo);
router.post("/address", controller.saveAddress);
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

router.post("/upload-id", upload.array("idProof", 5), controller.uploadIdProof);

router.post("/add-family-member", controller.addFamilyMember);

router.post("/terms-verify", controller.termsAndConditionVerify);

router.post("/complete", controller.completeSignUp);

router.post('/profile', controller.userprofile);
router.post('/profile-update', controller.updateBasicInfoAndAddress);

router.post('/signin', controller.signIn)

module.exports = router;