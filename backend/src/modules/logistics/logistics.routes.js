const express = require('express');
const router = express.Router();
const logisticsController = require('./logistics.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Assign a rider to an order (admin/operator)
router.post('/assign', protect, logisticsController.assignRider);

module.exports = router;