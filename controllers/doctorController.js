const {readJSON, writeJSON} = require('../utils/file');
const path = require('path');
const bcrypt = require('bcryptjs');
const doctorsFile = path.join(__dirname, '../data/doctors.json');
const Doctor = require('../models/doctorModel');

class DoctorController {
    static async registerDoctor(req, res) {
        try {
            const {name, email, phone, specialization, password} = req.body

            if (!name || !email || !phone || !specialization || !password) {
                return res.status(400).json({error: 'All doctor fields are required.'});
            }

            const doctors = await readJSON(doctorsFile);

            const existingDoctor = doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase());
            if (existingDoctor) {
               return res.status(409).json({error: 'Doctor with the email already exists.'});
            }

            const newDoctor = await Doctor.create({
                name,
                email,
                phone,
                specialization,
                password
            });
            doctors.push(newDoctor);
            await writeJSON(doctorsFile, doctors);
            
            const { password: _, ...doctorWithoutPassword } = newDoctor;

            res.status(201).json({message: 'Doctor registered successfully',
                 doctor: doctorWithoutPassword});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    static async getAllDoctors(req, res) {
        try {
            const doctors = await readJSON(doctorsFile);

            const saveDoctors = doctors.map(({password, ...rest}) => rest);
            
            res.status(200).json({doctors: saveDoctors})
        } catch (error) {
            res.status(500).json({error: 'Failed to retrieve doctors.'})
        }
    }

    static async getDoctorById(req, res) {
        try {
            const {id} = req.params;
            const doctors = await readJSON(doctorsFile);
            const doctor = doctors.find(doc => doc.id === id);
            if (!doctor) {
                return res.status(404).json({error: 'Doctor not found.'});
            }

            const { password, ...doctorWithoutPassword } = doctor;
            res.status(200).json({doctor: doctorWithoutPassword});
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch doctor.'});
        }
    }

    static async loginDoctor(req, res) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
               return res.status(400).json({error: 'Email and password are required.'});
            }
            const doctors = await readJSON(doctorsFile);
            const doctor = doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase());
            if (!doctor) {
                return res.status(404).json({error: 'Doctor not found.'});
            }
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return res.status(401).json({error: 'Invalid credentials.'});
            }
            const { password: _, ...doctorWithoutPassword } = doctor;
            res.status(200).json({message: 'Login successful', doctor: doctorWithoutPassword});
        } catch (error) {
            res.status(500).json({error: 'Login failed.'});
        }
    }
}

module.exports = DoctorController;