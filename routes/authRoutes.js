const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

// Protected routes - require a valid JWT to access, used to test the token
router.get('/me', protect, getMe);
router.get('/users/profile', protect, getMe);

// Protected + authorized route - requires a valid JWT AND the 'admin' role
router.get('/admin/dashboard', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to the admin dashboard, user ${req.user.id}`,
  });
});

module.exports = router;
