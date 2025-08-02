const bcrypt = require('bcryptjs');

const hashPassword = async function(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log('Error hashing password:', error);
        throw error;
    }
};

const verifyPassword = async function(plain, hashed) {
    try {
        return await bcrypt.compare(plain, hashed);
    } catch (error) {
        console.log('Error verifying password:', error);
        throw error;
    }
}

module.exports = {hashPassword, verifyPassword};