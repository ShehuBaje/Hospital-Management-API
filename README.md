# Hospital Management API

A simple, class-based, role-driven Hospital Management System built with **Express.js**. It supports user registration and login for both doctors and patients, and includes patient record management, doctor authentication, and secure routing using middleware.


## Features

- Doctor & User Registration/Login
- Patient Management
- Role-based authentication (Doctors)
- File storage using JSON (upgradeable to a database)
- Class-based controller structure
- Uses `async/await` and `try/catch` consistently
- Password hashing with `bcryptjs`
- Error handling and route protection

## Folder Structure

hospital-management-api/
├── app.js # Main app setup with all routes
├── server.js # Starts the server
├── data/ # JSON storage files
│ ├── users.json
│ ├── doctors.json
│ └── patients.json
├── models/ # Data models using UUID
│ ├── userModel.js
│ ├── doctorModel.js
│ └── patientModel.js
├── controllers/ # Class-based route logic
│ ├── userController.js
│ ├── doctorController.js
│ └── patientController.js
├── routes/ # Express route handlers
│ ├── userRoutes.js
│ ├── doctorRoutes.js
│ └── patientRoutes.js
├── middlewares/ # Role-based authentication
│ ├── authUser.js
│ └── authDoctor.js
├── utils/ # Utility functions
│ └── file.js
└── package.json


## Installation

```bash
git clone https://github.com/your-username/hospital-management-api.git
cd hospital-management-api
npm install
Run the Server
node server.js
Server runs on http://localhost:5000 by default.

API Endpoints
User Routes (/api/users)
POST /register – Register a new user

POST /login – Login as user

Doctor Routes (/api/doctors)
POST /register – Register a new doctor

POST /login – Login as doctor

GET /profile – Authenticated doctor profile

GET / – List all doctors

GET /:id – Get doctor by ID

Patient Routes (/api/patients)
POST /register – Register a new patient

GET / – List all patients

GET /:id – Get patient by ID

Authentication
Doctors must login to access protected routes using middleware (authDoctor.js).

Passwords are hashed with bcryptjs.

JSON file-based authentication mimics token/session behavior and can be upgraded to JWT later.

Built With
Express.js

bcryptjs

uuid

Node.js fs.promises for file operations

Notes
This is a beginner-friendly, file-based simulation of a backend system.

Future upgrades can include:

JWT Token Authentication

MongoDB / PostgreSQL Database Integration

Admin role and appointment scheduling

Author
Shehu Baje Umar
Backend Developer.
shehuumarbaje@gmail.com

License
This project is open-source and free to use.