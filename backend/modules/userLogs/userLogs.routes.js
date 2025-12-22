const { listLogs, viewLogDetails } = require("./userLogs.Controller");
const auth = require('../../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post("/", auth, listLogs);
router.post("/detail", auth, viewLogDetails);

module.exports = router;