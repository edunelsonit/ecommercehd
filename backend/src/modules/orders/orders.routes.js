const express = require('express');
const router = express.Router();
const orderController = require('./orders.controller');
const {protect} = require('../../middlewares/auth.middleware');

// Fetch all orders for the logged-in user
router.get('/', protect, orderController.getOrders);

// Process checkout
router.post('/checkout', protect, orderController.createOrder);

// Riders call this to confirm delivery via the customer's OTP
router.post('/verify-delivery', protect, orderController.verifyOTP); 

module.exports = router;