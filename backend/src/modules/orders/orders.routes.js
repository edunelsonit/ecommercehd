const express = require('express');
const router = express.Router();
const orderController = require('./orders.controller');
const verifyToken = require('../../middlewares/auth.middleware');

router.get('/', verifyToken, orderController.getOrders);
router.post('/checkout', verifyToken, orderController.createOrder);
// Riders use this to verify the customer's OTP
router.post('/verify-delivery', verifyToken, orderController.verifyOTP); 

module.exports = router;
