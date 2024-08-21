// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const ludoController = require('../controllers/LudoController');

// view    
router.get('/:user', ludoController.index);

// backend 
router.get('/get-info/:user', ludoController.userInfo);

module.exports = router;
