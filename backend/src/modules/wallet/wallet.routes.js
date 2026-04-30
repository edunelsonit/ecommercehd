const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const verifyToken = require('../../middlewares/auth.middleware');

router.get('/balance', verifyToken, walletController.getBalance);
router.post('/fund', verifyToken, walletController.fundWallet);

module.exports = router;
