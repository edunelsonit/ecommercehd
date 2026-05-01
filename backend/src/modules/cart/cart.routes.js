const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const verifyTokenOptional = require('../../middlewares/auth-optional.middleware'); // A middleware that doesn't block if no token

// Get current cart status
router.get('/', verifyTokenOptional, cartController.getCart);

// Add item to cart
router.post('/add', verifyTokenOptional, cartController.addToCart);

// Update item quantity
router.patch('/quantity', verifyTokenOptional, cartController.updateQuantity);

// Remove specific item
router.delete('/item/:cartItemId', verifyTokenOptional, cartController.removeItem);

// Clear entire cart
router.delete('/clear', verifyTokenOptional, cartController.clearCart);

module.exports = router;