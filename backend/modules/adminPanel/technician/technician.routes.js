const express = require('express');
const { registerTechnician, loginTechnician, updateTechnician, deleteTechnician, profile, technicianList } = require('./technician.controller');
const upload = require('../../../middleware/fileUpload');
const router = express.Router();
const auth = require('../../../middleware/authMiddleware');

router.post('/register', auth, upload.fields([
    { name: 'image', maxCount: 1 },
]), registerTechnician);
router.post('/login', loginTechnician);
router.post('/update-profile', auth, upload.fields([
    { name: 'image', maxCount: 1 },
]), updateTechnician);
router.post('/delete', auth, deleteTechnician);
router.post('/profile', auth, profile);
router.post('/list', auth, technicianList);

module.exports = router;