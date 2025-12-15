const { verifyAccount, verificaionAccountList, usersList, viewAccount } = require('./accountVerification.controller');
const express = require('express');
const router = express.Router();

router.post('/', verifyAccount);
router.get('/list', verificaionAccountList);
router.get('/all-user-list', usersList);
router.post('/view', viewAccount);

module.exports = router;