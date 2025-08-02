const path = require('path');
const { readJSON, writeJSON } = require('../utils/file');
const Patient = require('../models/patientModel');
const patientFile = path.join(__dirname, '../data/patients.json');

class PatientController {
    static async registerPatient(req, res) {
        try {
            const { name, age, gender, email, phone, address, medicalHistory } = req.body;

            if (!name || !age || !gender || !email || !phone || !address) {
                return res.status(400).json({ error: 'All patient fields are required.' });
            }

            const patients = await readJSON(patientFile);

            const existing = patients.find(p => p.email.toLowerCase() === email.toLowerCase());
            if (existing) {
                return res.status(409).json({ error: 'Patient with this email already exists.' });
            }

            const newPatient = await Patient.create({
                name,
                age,
                gender,
                email,
                phone,
                address,
                medicalHistory
            });

            patients.push(newPatient);
            await writeJSON(patientFile, patients);

            res.status(201).json({
                message: 'Patient registered successfully',
                patient: newPatient
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllPatients(req, res) {
        try {
            const patients = await readJSON(patientFile);
            res.status(200).json({patients});
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch patients.'});
        }
    }

    static async getPatientById(req, res) {
        try {
            const {id} = req.params;
            const patients = await readJSON(patientFile);
            const patient = patients.find(p => p.id === id);
            if (!patient) {
                return res.status(404).json({error: 'Patient not found.'});
            }

            res.status(200).json({patient});
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch patient'});
        }
    }
}

module.exports = PatientController;