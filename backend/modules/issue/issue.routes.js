const express = require('express');
const { addIssue, listIssue, updateIssue, deleteIssue } = require('./issue.controller');
const router = express.Router();

router.post('/add', addIssue);
router.get('/', listIssue);
router.post('/update', updateIssue);
router.post('/delete', deleteIssue);

module.exports = router