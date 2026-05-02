const express = require('express');
const router = express.Router();
const supportController = require('./support.controller');
const {protect} = require('../../middlewares/auth.middleware');

router.post('/disputes', protect, supportController.fileDispute);

module.exports = router;
