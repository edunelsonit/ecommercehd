const express = require('express');
const vendorCtrl = require('./vendor.controllers');
const { protect, vendorOnly } = require('../../middlewares/auth.middleware');

const router = express.Router();

// All vendor routes require authentication and vendor role
router.use(protect);
router.use(vendorOnly);

router.get('/profile', vendorCtrl.getVendorProfile);
router.post('/products', vendorCtrl.createProduct);

module.exports = router;