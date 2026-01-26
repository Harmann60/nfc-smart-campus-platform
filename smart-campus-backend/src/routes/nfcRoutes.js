
const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfcController');

// 1. Route to simulate a card tap
router.post('/scan', nfcController.scanCard);

// 2. 💰 Route to add money (This is the missing link!)
router.post('/topup', nfcController.topUpWallet);

// 3. Route to get logs
router.get('/logs', nfcController.getLogs);

module.exports = router;