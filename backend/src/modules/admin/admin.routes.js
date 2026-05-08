const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Apply protection to all admin routes
router.use(protect);

// Route for the main stats cards and pipeline
router.get('/stats', adminController.getDashboardStats);

// Route for general overview (if needed separately)
router.get('/overview', adminController.getOverview);
router.post('/vendors', adminController.addVendor);

// Route for the recent orders table
router.get('/recent-orders', adminController.getRecentOrders);

router.get('/users', adminController.getEligibleUsers);

router.get('/logistics', adminController.getLogisticsData);

router.get('/procurements', adminController.getProcurements);

router.get('/financials', adminController.getFinancialOverview);

module.exports = router;