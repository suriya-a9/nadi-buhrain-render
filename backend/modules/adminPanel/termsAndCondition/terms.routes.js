const express = require('express');
const { addTerms, listTerms, updateTerms, deleteTerms } = require('./terms.controller');
const auth = require("../../../middleware/authMiddleware");

const router = express.Router();

router.post('/add', auth, addTerms);
router.get('/', listTerms);
router.post('/update', auth, updateTerms);
router.post('/delete', auth, deleteTerms);

module.exports = router;