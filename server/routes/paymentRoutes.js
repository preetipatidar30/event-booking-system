const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    processRefund
} = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/refund', protect, adminOnly, processRefund);

module.exports = router;
