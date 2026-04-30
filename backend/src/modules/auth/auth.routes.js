const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { registerSchema } = require('../../utils/validation');

// Validation Middleware
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);

module.exports = router;
