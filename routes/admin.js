// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const AdminDashboard = require('../controllers/Admin/AdminDashboardController');
const AdminLudo = require('../controllers/Admin/AdminLudoController');
const authMiddleware = require('../middleware/authMiddleware');

// login 
router.get('/login', AdminDashboard.login);
router.post('/login-submit', AdminDashboard.loginSubmit);

// protected routes 

// Dashboard    
router.get('/', authMiddleware, AdminDashboard.index);

// ludo games 
router.get('/game-ludo', authMiddleware, AdminLudo.index);
router.post('/game-ludo', authMiddleware, AdminLudo.manageData);


module.exports = router;
