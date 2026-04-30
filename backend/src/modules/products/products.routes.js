const express = require('express');
const router = express.Router();
const productController = require('./products.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Public routes for browsing
router.get('/', productController.getProducts);

// Protected routes
router.post('/add', verifyToken, productController.createProduct);
router.post('/temporary', verifyToken, productController.createTemporaryProduct);
router.patch('/stock', verifyToken, productController.updateStock);

module.exports = router;
