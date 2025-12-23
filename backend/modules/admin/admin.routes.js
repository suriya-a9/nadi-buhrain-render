const express = require('express');
const { adminRegister, adminLogin, listAdmins, updateAdmin } = require('./admin.controller');

const router = express.Router();

router.post("/register", adminRegister);
router.post('/login', adminLogin);
router.get("/list", listAdmins);
router.post("/:id", updateAdmin);

module.exports = router;