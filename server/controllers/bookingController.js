const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { eventId, quantity } = req.body;

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is active
        if (!event.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Event is not available for booking'
            });
        }

        // Check booking deadline
        if (new Date() > new Date(event.bookingDeadline)) {
            return res.status(400).json({
                success: false,
                message: 'Booking deadline has passed'
            });
        }

        // Check availability
        if (event.availableSeats < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${event.availableSeats} seats available`
            });
        }

        // Calculate total
        const totalAmount = event.price * quantity;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            quantity,
            totalAmount,
            paymentStatus: 'completed', // For demo, mark as completed
            bookingStatus: 'confirmed'
        });

        // Update available seats
        event.availableSeats -= quantity;
        await event.save();

        // Create notification
        await Notification.create({
            user: req.user.id,
            title: 'Booking Confirmed!',
            message: `Your booking for ${event.title} has been confirmed. Ticket Code: ${booking.ticketCode}`,
            type: 'booking',
            link: `/bookings/${booking._id}`
        });

        // Populate booking with event details
        await booking.populate('event', 'title date time location imageUrl');

        res.status(201).json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('event', 'title date time location imageUrl price category');

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check ownership or admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check ownership or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if already cancelled
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        // Restore seats
        const event = await Event.findById(booking.event);
        if (event) {
            event.availableSeats += booking.quantity;
            await event.save();
        }

        // Create notification
        await Notification.create({
            user: booking.user,
            title: 'Booking Cancelled',
            message: `Your booking (${booking.ticketCode}) has been cancelled and refunded.`,
            type: 'cancellation'
        });

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .populate('event', 'title date time location')
            .populate('user', 'name email');

        // Calculate stats
        const totalRevenue = bookings
            .filter(b => b.paymentStatus === 'completed')
            .reduce((sum, b) => sum + b.totalAmount, 0);

        const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.bookingStatus === 'cancelled').length;

        res.status(200).json({
            success: true,
            count: bookings.length,
            stats: {
                totalRevenue,
                confirmedBookings,
                cancelledBookings
            },
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get booking stats (Admin)
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
        const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });

        const revenueResult = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        // Monthly revenue for chart
        const monthlyRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue,
                monthlyRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
