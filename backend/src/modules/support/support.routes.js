const express = require('express');
const router = express.Router();
const supportController = require('./support.controller');
const verifyToken = require('../../middlewares/auth.middleware');

router.post('/disputes', verifyToken, supportController.fileDispute);

module.exports = router;
