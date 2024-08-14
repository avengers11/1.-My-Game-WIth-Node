// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const JiliFish = require('../controllers/JiliFishController');

// view    
router.get('/:user', JiliFish.index);

// API 
router.get('/users', JiliFish.getAllUsers);

module.exports = router;
