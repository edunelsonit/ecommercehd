const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Overview statistics for admin dashboard
router.get('/overview', protect, adminController.getOverview);
router.get('/recent-orders', protect, adminController.getRecentOrders);

module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
// const { protect, restrictTo } = require('../../middlewares/auth.middleware');

// Apply protection to all admin routes
router.use(protect);
router.use(restrictTo('admin', 'superadmin'));

router.get('/stats', adminController.getDashboardStats);

module.exports = router;