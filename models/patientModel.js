const {v4: uuidv4} = require('uuid');

class Patient {
    constructor({id, name, age, gender, email, phone, address, medicalHistory, createdAt }) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.medicalHistory = medicalHistory || [];
        this.createdAt = createdAt || new Date().toISOString();
    }

    static async create(data) {
        try {
            const {
                name, age, gender, email, phone, address, medicalHistory
            } = data;

            if (!name || !age || !gender || !email || !phone || !address) {
                throw new Error('Missing required patient field.');
            }

            const newPatient = new Patient({
                id: uuidv4(),
                name,
                age,
                gender,
                email,
                phone,
                address,
                medicalHistory: medicalHistory || [],
                createdAt: new Date().toISOString()
            });
            return newPatient;
        } catch (error) {
            throw new Error(`Patient creation failed ${error.message}`);
        }
    }
}

module.exports = Patient;