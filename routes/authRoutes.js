const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected routes - require a valid JWT to access, used to test the token
router.get('/me', protect, getMe);
router.get('/users/profile', protect, getMe);

module.exports = router;
