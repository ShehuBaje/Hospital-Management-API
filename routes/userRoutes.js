const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authUser = require('../middlewares/authUsers');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/profile', authUser, (req, res) => {
    res.status(200).json({message: 'User authenticated', user: req.user});
});
router.get('/', authUser, UserController.getAllUsers);
router.get('/:id', authUser, UserController.getUserById);

module.exports = router;