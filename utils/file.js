const fs = require('fs').promises;

const readJSON = async function(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

const writeJSON = async function(data, filePath) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing file:', error);
        throw error;
    }
}

module.exports = {readJSON, writeJSON};