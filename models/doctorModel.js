const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');

class Doctor {
    constructor({id, name, email, phone, specialization, password, createdAt}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.password = password,
        this.createdAt = createdAt || new Date().toISOString();
    }

    static async create(data) {
        try {
            const {name, email, phone, specialization, password} = data;

            if (!name || !email || !phone || !specialization|| !password) {
                throw new Error('Missing required doctor field.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newDoctor = new Doctor({
                id: uuidv4(),
                name,
                email,
                phone,
                specialization,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            });

            return newDoctor;
        } catch (error) {
            throw new Error(`Error creating doctor: ${error.message}`);
        }
    }
}

module.exports = Doctor;