const express = require('express');
const router = express.Router();
const deliveryController = require('./delivery.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Riders: Update trip progress
router.patch('/status', protect, deliveryController.updateDeliveryStatus);

// Riders: Finalize with Customer OTP
router.post('/verify-otp', protect, deliveryController.completeDelivery);

// Customers: Get last known location (Polling fallback for Sockets)
router.get('/track/:orderId', protect, deliveryController.getTracking);

module.exports = router;