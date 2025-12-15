const express = require('express');
const { addTerms, listTerms, updateTerms, deleteTerms } = require('./terms.controller');

const router = express.Router();

router.post('/add', addTerms);
router.get('/', listTerms);
router.post('/update', updateTerms);
router.post('/delete', deleteTerms);

module.exports = router;