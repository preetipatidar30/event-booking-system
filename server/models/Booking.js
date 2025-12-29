const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide ticket quantity'],
        min: [1, 'Quantity must be at least 1'],
        max: [10, 'Maximum 10 tickets per booking']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    ticketCode: {
        type: String,
        unique: true
    },
    attendees: [{
        name: String,
        email: String
    }]
}, {
    timestamps: true
});

// Generate unique ticket code
bookingSchema.pre('save', function (next) {
    if (!this.ticketCode) {
        this.ticketCode = 'TKT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
