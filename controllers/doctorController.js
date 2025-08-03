const { readJSON, writeJSON } = require('../utils/file');
const path = require('path');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const doctorsFile = path.join(__dirname, '../data/doctors.json');
const Doctor = require('../models/doctorModel');

class DoctorController {
    static async registerDoctor(req, res, next) {
        try {
            const { name, email, phone, specialization, password } = req.body;

            if (!name || !email || !phone || !specialization || !password) {
                return next(new AppError('All doctor fields are required.', 400));
            }

            const doctors = await readJSON(doctorsFile);
            const existingDoctor = doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase());

            if (existingDoctor) {
                return next(new AppError('Doctor with the email already exists.', 409));
            }

            const newDoctor = await Doctor.create({ name, email, phone, specialization, password });
            doctors.push(newDoctor);
            await writeJSON(doctorsFile, doctors);

            const { password: _, ...doctorWithoutPassword } = newDoctor;

            res.status(201).json({
                message: 'Doctor registered successfully',
                doctor: doctorWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllDoctors(req, res, next) {
        try {
            const doctors = await readJSON(doctorsFile);
            const safeDoctors = doctors.map(({ password, ...rest }) => rest);

            res.status(200).json({ doctors: safeDoctors });
        } catch (error) {
            next(new AppError('Failed to retrieve doctors.', 500));
        }
    }

    static async getDoctorById(req, res, next) {
        try {
            const { id } = req.params;
            const doctors = await readJSON(doctorsFile);
            const doctor = doctors.find(doc => doc.id === id);

            if (!doctor) {
                return next(new AppError('Doctor not found.', 404));
            }

            const { password, ...doctorWithoutPassword } = doctor;
            res.status(200).json({ doctor: doctorWithoutPassword });
        } catch (error) {
            next(error);
        }
    }

    static async loginDoctor(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Email and password are required.', 400));
            }

            const doctors = await readJSON(doctorsFile);
            const doctor = doctors.find(doc => doc.email.toLowerCase() === email.toLowerCase());

            if (!doctor) {
                return next(new AppError('Doctor not found.', 404));
            }

            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return next(new AppError('Invalid credentials.', 401));
            }

            const { password: _, ...doctorWithoutPassword } = doctor;
            res.status(200).json({ message: 'Login successful', doctor: doctorWithoutPassword });
        } catch (error) {
            next(new AppError('Login failed.', 500));
        }
    }
}

module.exports = DoctorController;