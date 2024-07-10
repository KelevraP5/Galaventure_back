const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require("../middlewares/jwt");


router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.get('/profile', authenticateJWT, userController.getUserProfile);
router.get('/allUsers', authenticateJWT, userController.getAllUsers);

router.put('/update', authenticateJWT, userController.updateUserProfile);

router.delete('/delete', authenticateJWT, userController.deleteUserProfile);

module.exports = router;