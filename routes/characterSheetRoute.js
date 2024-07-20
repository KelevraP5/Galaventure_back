const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/characterSheetController');
const evoCharacterController = require('../controllers/evoCharacterController');
const authenticateJWT = require('../middlewares/jwt');

router.post('/createSheet', authenticateJWT, sheetController.createSheet);
router.get('/getSheet/:id', sheetController.getOneSheet);
router.delete('/deleteSheet/:id', sheetController.deleteCharacterSheet);

router.post('/postSheet/:id', evoCharacterController.postCharacterSheet);


module.exports = router;
