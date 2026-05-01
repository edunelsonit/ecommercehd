const express = require('express');
const router = express.Router();
const orderController = require('./orders.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Fetch all orders for the logged-in user
router.get('/', verifyToken, orderController.getOrders);

// Process checkout
router.post('/checkout', verifyToken, orderController.createOrder);

// Riders call this to confirm delivery via the customer's OTP
router.post('/verify-delivery', verifyToken, orderController.verifyOTP); 

module.exports = router;