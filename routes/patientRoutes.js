const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

router.post('/register', PatientController.registerPatient);
router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);

module.exports = router;
