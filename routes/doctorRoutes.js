const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctorController');
const authDoctor = require('../middlewares/authDoctor');

router.post('/register', DoctorController.registerDoctor);
router.post('/login', DoctorController.loginDoctor);
router.get('/', authDoctor, DoctorController.getAllDoctors);
router.get('/:id', authDoctor, DoctorController.getDoctorById);
router.get('/profile', authDoctor, (req, res) => {
    res.status(200).json({error: 'Doctors authenticated.', doctor: req.doctor});
})

module.exports = router;