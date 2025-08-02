const path = require('path');
const bcrypt = require('bcryptjs');
const {readJSON} = require('../utils/file');
const doctorsFile = path.join(__dirname, '../data/doctors.json');

async function authDoctor(req, res, next) {
    try {
        const {email, password} = req.headers;
        if (!email || !password) {
            return res.status(401).json({error: 'Email or password missing.'});
        }
        const doctors = await readJSON(doctorsFile);
        const doctor = doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase());
        if (!doctor) {
            return res.status(404).json({error: 'Doctor not found.'});
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
           return res.status(403).json({error: 'Invalid password.'});
        }

        const {password: _, ...doctorWithoutPassword} = doctor;
        req.doctor = doctorWithoutPassword;
        next();
    } catch (error) {
        res.status(500).json({error: 'Failed to authenticate.'})
    }
}

module.exports = authDoctor;