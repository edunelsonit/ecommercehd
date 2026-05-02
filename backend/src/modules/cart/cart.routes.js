const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const verifyToken = require('../../middlewares/auth.middleware'); // A middleware that doesn't block if no token

// Get current cart status
router.get('/', verifyToken, cartController.getCart);

// Add item to cart
router.post('/add', verifyToken, cartController.addToCart);

// Update item quantity
router.patch('/quantity', verifyToken, cartController.updateQuantity);

// Remove specific item
router.delete('/item/:cartItemId', verifyToken, cartController.removeItem);

// Clear entire cart
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;