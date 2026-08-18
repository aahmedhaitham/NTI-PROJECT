const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected route - requires a valid JWT to access, used to test the token
router.get('/me', protect, getMe);

module.exports = router;
