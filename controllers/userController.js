const path = require('path');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/file');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const usersFile = path.join(__dirname, '../data/users.json');

class UserController {
    static async registerUser(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return next(new AppError('All fields (name, email, password, role) are required.', 400));
            }

            const users = await readJSON(usersFile);

            const emailExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (emailExists) {
                return next(new AppError('Email already in use.', 409));
            }

            const newUser = await User.create({ name, email, role, password });
            users.push(newUser);
            await writeJSON(usersFile, users);

            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json({
                message: 'User registered successfully',
                user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new AppError('Email and password are required.', 400));
            }

            const users = await readJSON(usersFile);
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return next(new AppError('Invalid email or password.', 401));
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(new AppError('Invalid email or password.', 401));
            }

            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json({
                message: 'Login successful',
                user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await readJSON(usersFile);
            const safeUsers = users.map(({ password, ...rest }) => rest);
            res.status(200).json({ users: safeUsers });
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const users = await readJSON(usersFile);
            const user = users.find(u => u.id === id);

            if (!user) {
                return next(new AppError('User not found.', 404));
            }

            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json({ user: userWithoutPassword });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;