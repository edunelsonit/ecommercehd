const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const verifyToken = require('../../middlewares/auth.middleware');

// View balance and recent transactions
router.get('/balance', verifyToken, walletController.getBalance);

// Fund the wallet (Usually called after a successful Paystack/Flutterwave callback)
router.post('/fund', verifyToken, walletController.fundWallet);

module.exports = router;