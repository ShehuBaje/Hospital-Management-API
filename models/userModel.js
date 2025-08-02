const hashPassword = require('../utils/password');
const {v4: uuidv4} = require('uuid');

class User {
    constructor(name, email, role, password) {
        this.id = uuidv4();
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
        this.createdAt = new Date().toISOString();
    }

    static async create({name, email, role, password}) {
        try {
            const hashedPassword = await hashPassword(password);
            return new User(name, email, role, hashedPassword)
        } catch (error) {
            console.log('Error creating user:', error.message);
            throw new Error('Failed to create user.');
        }
    }
}

module.exports = User;