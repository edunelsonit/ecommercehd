const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Apply protection to all admin routes
router.use(protect);

// Route for the main stats cards and pipeline
router.get('/stats', protect, adminController.getDashboardStats);

// Route for general overview (if needed separately)
router.get('/overview', protect, adminController.getOverview);
router.post('/vendors', protect, adminController.addVendor);

// Route for the recent orders table
router.get('/recent-orders', protect, adminController.getRecentOrders);

module.exports = router;