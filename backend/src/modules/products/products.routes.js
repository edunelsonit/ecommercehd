const express = require('express');
const router = express.Router();
const productController = require('./products.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Public routes for browsing
router.get('/', productController.getProducts);

// Protected routes for vendors
router.post('/add', verifyToken, productController.createProduct);
router.patch('/stock', verifyToken, productController.updateStock);

module.exports = router;