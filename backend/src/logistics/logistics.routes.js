const express = require('express');
const router = express.Router();
const logisticsController = require('./logistics.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/assign-rider', verifyToken, logisticsController.assignRider);

module.exports = router;
