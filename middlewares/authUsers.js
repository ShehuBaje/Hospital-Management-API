const path = require('path');
const bcrypt = require('bcryptjs');
const usersFile = path.join(__dirname, '../data/users.json');
const {readJSON} = require('../utils/file');

async function authUser(req, res, next) {
    try {
        const {email, password} = req.headers;
        if (!email || !password) {
           return res.status(401).json({error: 'Email or password missing.'});
        }
        const users = await readJSON(usersFile);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(404).json({error: 'User not found.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({error: 'Invalid password.'});
        }
        const {password: _, ...userWithoutPassword} = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        res.status(500).json({error: 'Failed to authenticate.'});
    }
}

module.exports = authUser;