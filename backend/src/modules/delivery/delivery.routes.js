const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Riders: Update trip progress
router.patch('/status', verifyToken, deliveryController.updateDeliveryStatus);

// Riders: Finalize with Customer OTP
router.post('/verify-otp', verifyToken, deliveryController.completeDelivery);

// Customers: Get last known location (Polling fallback for Sockets)
router.get('/track/:orderId', verifyToken, deliveryController.getTracking);

module.exports = router;