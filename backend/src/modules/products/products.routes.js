const express = require('express');
const router = express.Router();
const productController = require('./products.controller');
const {protect} = require('../../middlewares/auth.middleware');

// Public: View marketplace
router.get('/', productController.getProducts);

// Vendor/Admin: Manage inventory
router.post('/add', protect, productController.createProduct);
router.patch('/stock', protect, productController.updateStock);

module.exports = router;