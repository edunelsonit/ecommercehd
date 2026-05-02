const express = require('express');
const router = express.Router();
const walletController = require('./wallet.controller');
const {protect} = require('../../middlewares/auth.middleware');

// View balance and recent transactions
router.get('/balance', protect, walletController.getBalance);
// Fund the wallet (Usually called after a successful Paystack/Flutterwave callback)
router.post('/fund', protect, walletController.fundWallet);

module.exports = router;