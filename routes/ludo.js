// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const ludoController = require('../controllers/LudoController');

// view    
router.get('/:user', ludoController.index);

module.exports = router;
