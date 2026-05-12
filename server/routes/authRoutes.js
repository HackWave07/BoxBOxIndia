const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getProfile, updateProfile, updateAddresses } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: { message: 'Too many login attempts, please try again later' }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/addresses', protect, updateAddresses);

// Google OAuth for Customers
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], state: 'customer' }));

// Google OAuth for Admin (Owner)
router.get('/google/admin', passport.authenticate('google', { scope: ['profile', 'email'], state: 'admin' }));

const frontendUrl = process.env.NODE_ENV === 'production' 
  ? (process.env.FRONTEND_URL || 'https://boxboxindia.com') 
  : 'http://localhost:5173';

router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${frontendUrl}/login?error=OAuthFailed` }), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect('/login?error=OAuthFailed');
    }

    const state = req.query.state;

    // Admin Login Flow
    if (state === 'admin') {
      if (req.user.email !== 'BoxBoxindia@gmail.com') {
        return res.redirect(`${frontendUrl}/admin-login?error=UnauthorizedAdmin`);
      }
      
      // Ensure the role is owner
      if (req.user.role !== 'owner') {
        req.user.role = 'owner';
        await req.user.save();
      }

      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.redirect(`${frontendUrl}/admin-login?token=${token}`);
    }

    // Customer Login Flow
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
