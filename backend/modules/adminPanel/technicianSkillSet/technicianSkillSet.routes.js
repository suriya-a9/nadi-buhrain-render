const express = require('express');
const { listSkillSet, addSkillSet, updateSkillSet, deleteSkillSet } = require('./technicianSkillSet.contoller');
const router = express.Router();

router.post('/add', addSkillSet);
router.get('/', listSkillSet);
router.post('/update', updateSkillSet);
router.post('/delete', deleteSkillSet);

module.exports = router;