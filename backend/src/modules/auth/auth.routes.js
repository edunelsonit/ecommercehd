const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const {protect} = require('../../middlewares/auth.middleware');
const { registerSchema } = require('../../utils/validation');

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.put('/update-profile', authController.updateProfile)
router.post('/vendor-profile', protect, authController.createVendorProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.patch('/reset-password', authController.resetPassword);

// This route is now LOCKED behind a token
router.get('/profile', protect, authController.getProfile);

module.exports = router;