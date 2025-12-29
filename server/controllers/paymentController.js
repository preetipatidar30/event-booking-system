// Dummy payment controller for college assignment
// In production, integrate with Stripe or PayPal

const Booking = require('../models/Booking');

// @desc    Create payment intent (dummy)
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        // Simulate payment intent creation
        const paymentIntent = {
            id: 'pi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            amount: amount * 100, // In cents
            currency: 'inr',
            status: 'requires_payment_method',
            client_secret: 'dummy_secret_' + Date.now()
        };

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Confirm payment (dummy)
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId } = req.body;

        // Find and update booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking with payment info
        booking.paymentId = paymentIntentId;
        booking.paymentStatus = 'completed';
        booking.bookingStatus = 'confirmed';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Payment confirmed',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Process refund (dummy)
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Simulate refund
        booking.paymentStatus = 'refunded';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            refundId: 'rf_' + Date.now(),
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
