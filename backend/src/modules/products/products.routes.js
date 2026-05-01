const express = require('express');
const router = express.Router();
const productController = require('./products.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// Public: View marketplace
router.get('/', productController.getProducts);

// Vendor/Admin: Manage inventory
router.post('/add', verifyToken, productController.createProduct);
router.patch('/stock', verifyToken, productController.updateStock);

module.exports = router;