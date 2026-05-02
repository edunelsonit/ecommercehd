const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const {protect} = require('../../middlewares/auth.middleware'); // A middleware that doesn't block if no token

// Get current cart status
router.get('/', protect, cartController.getCart);

// Add item to cart
router.post('/add', protect, cartController.addToCart);

// Update item quantity
router.patch('/quantity', protect, cartController.updateQuantity);

// Remove specific item
router.delete('/item/:cartItemId', protect, cartController.removeItem);

// Clear entire cart
router.delete('/clear', protect, cartController.clearCart);

module.exports = router;