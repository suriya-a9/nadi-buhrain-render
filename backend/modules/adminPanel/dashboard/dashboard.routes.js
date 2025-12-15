const { dashboardCharts } = require('./dashboard.controller');

const express = require('express');
const router = express.Router();

router.get('/counts', dashboardCharts);

module.exports = router;