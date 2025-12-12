// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/me', authMiddleware.authenticate, authController.me);
router.post('/logout', authMiddleware.authenticate, authController.logout);

module.exports = router;