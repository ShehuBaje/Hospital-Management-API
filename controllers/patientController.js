const path = require('path');
const { readJSON, writeJSON } = require('../utils/file');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const patientFile = path.join(__dirname, '../data/patients.json');

class PatientController {
    static async registerPatient(req, res, next) {
        try {
            const { name, age, gender, email, phone, address, medicalHistory } = req.body;

            if (!name || !age || !gender || !email || !phone || !address) {
                throw new AppError('All patient fields are required.', 400);
            }

            const patients = await readJSON(patientFile);

            const existing = patients.find(p => p.email.toLowerCase() === email.toLowerCase());
            if (existing) {
                throw new AppError('Patient with this email already exists.', 409);
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
            next(error);
        }
    }

    static async getAllPatients(req, res, next) {
        try {
            const patients = await readJSON(patientFile);
            res.status(200).json({ patients });
        } catch (error) {
            next(error);
        }
    }

    static async getPatientById(req, res, next) {
        try {
            const { id } = req.params;
            const patients = await readJSON(patientFile);
            const patient = patients.find(p => p.id === id);
            if (!patient) {
                throw new AppError('Patient not found.', 404);
            }

            res.status(200).json({ patient });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PatientController;