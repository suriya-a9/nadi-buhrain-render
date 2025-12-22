const express = require('express');
const { addPoints, listPoints, updatePoints, transferPointsWithFamily, requestPointsToFamily, requestList } = require('./points.controller');
const auth = require('../../../middleware/authMiddleware');

const router = express.Router();

router.post('/add', auth, addPoints);
router.get('/', listPoints);
router.post('/update', auth, updatePoints);
router.post('/transfer-points', auth, transferPointsWithFamily);
router.post('/requestToFamily', auth, requestPointsToFamily);
router.post('/requestList', auth, requestList);

module.exports = router;