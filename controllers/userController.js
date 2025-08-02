const path = require('path');
const { readJSON, writeJSON } = require('../utils/file');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const usersFile = path.join(__dirname, '../data/users.json');

class UserController {
    static async registerUser(req, res) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({ error: 'All fields are required.' });
            }

            const users = await readJSON(usersFile);

            const emailExists = users.find(u => u.email === email);
            if (emailExists) {
                return res.status(409).json({ error: 'Email already registered.' });
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
            console.error('User registration error:', error.message);
            res.status(500).json({ error: 'Something went wrong while registering user.' });
        }
    }

    static async loginUser(req, res) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).json({error: 'Email and password are required.'})
            }

            const users = await readJSON(usersFile);
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({error: 'Invalid credentials'});
            }

            const {password: _, ...userWithoutPassword} = user;
            res.status(200).json({message: 'Login successful.', user: userWithoutPassword});
        } catch (error) {
            res.status(500).json({error: 'Login failed.'});
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await readJSON(usersFile);
            const saveUsers = users.map(({password, ...rest}) => rest);
            res.status(200).json({users: saveUsers});
        } catch (error) {
            res.status(500).json({error: 'Failed to retrieve users.'});
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const users = await readJSON(usersFile);
            const user = users.find(u => u.id === id);
            if (!user) {
               return res.status(404).json({error: 'User not found.'});
            }

            const {password: _, ...userWithoutPassword} = user;
            res.status(200).json({user: userWithoutPassword});
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch user.'});
        }
    }
}

module.exports = UserController;