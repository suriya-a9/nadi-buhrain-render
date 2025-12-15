const { singleRequest, bulkRequest, responseMaterialRequest } = require('./materialRequest.controller');
const auth = require('../../../middleware/authMiddleware');

const express = require('express');

const router = express.Router();

router.post('/single-request', auth, singleRequest);
router.post('/bulk-request', auth, bulkRequest);
router.post('/request-status', auth, responseMaterialRequest);

module.exports = router;