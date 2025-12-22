const { verifyAccount, verificaionAccountList, usersList, viewAccount } = require('./accountVerification.controller');
const auth = require("../../../middleware/authMiddleware");
const express = require('express');
const router = express.Router();

router.post('/', auth, verifyAccount);
router.get('/list', auth, verificaionAccountList);
router.get('/all-user-list', auth, usersList);
router.post('/view', auth, viewAccount);

module.exports = router;