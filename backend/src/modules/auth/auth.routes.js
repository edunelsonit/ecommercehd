const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const verifyToken = require('../../middlewares/auth.middleware');
const { registerSchema } = require('../../utils/validation');

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/vendor-profile', verifyToken, authController.createVendorProfile);

module.exports = router;