// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const GreadyController = require('../controllers/GreadyController');

// view    
router.get('/:user', GreadyController.index);

// backend 

module.exports = router;
