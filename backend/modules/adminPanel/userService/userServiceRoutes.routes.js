const { newUserServiceRequest, updateServiceStatus, assignTechnician, technicianRespond, acceptedServiceRequests, getTechnicianWorkStatus } = require('./userServiceController.controller');
const auth = require('../../../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/', newUserServiceRequest);
router.post('/update-status', auth, updateServiceStatus);
router.post('/assign-technician', auth, assignTechnician);
router.post('/technician-respond', auth, technicianRespond);
router.get('/accpeted-requests', acceptedServiceRequests);
router.get('/technician-work-status/:userServiceId', getTechnicianWorkStatus);
module.exports = router;