const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require("../middlewares/jwt");


router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/profile', authenticateJWT,userController.getUserProfile);

module.exports = router;