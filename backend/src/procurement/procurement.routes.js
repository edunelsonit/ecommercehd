const express = require('express');
const router = express.Router();
const procurementController = require('./procurement.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/request', verifyToken, procurementController.requestProcurement);

module.exports = router;
