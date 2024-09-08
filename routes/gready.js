// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const GreadyController = require('../controllers/GreadyController');

// view    
// router.get('/:user', GreadyController.index);
router.get('/game-data', GreadyController.gameData);
router.get('/user-info', GreadyController.usersInfo);

// backend 
module.exports = router;
