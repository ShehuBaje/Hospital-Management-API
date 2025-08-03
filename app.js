const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

app.use((req, res) => {
    res.status(404).json({error: 'Route not found.'});
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;