const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        let query = { isActive: true };

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by city
        if (req.query.city) {
            query['location.city'] = new RegExp(req.query.city, 'i');
        }

        // Filter by date range
        if (req.query.startDate) {
            query.date = { $gte: new Date(req.query.startDate) };
        }
        if (req.query.endDate) {
            query.date = { ...query.date, $lte: new Date(req.query.endDate) };
        }

        // Filter by price range
        if (req.query.minPrice) {
            query.price = { $gte: parseFloat(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
        }

        // Filter upcoming events only
        if (req.query.upcoming === 'true') {
            query.date = { $gte: new Date() };
        }

        // Search by title
        if (req.query.search) {
            query.title = new RegExp(req.query.search, 'i');
        }

        // Sorting
        let sortOption = { date: 1 }; // Default: upcoming first
        if (req.query.sort === 'price_low') {
            sortOption = { price: 1 };
        } else if (req.query.sort === 'price_high') {
            sortOption = { price: -1 };
        } else if (req.query.sort === 'newest') {
            sortOption = { createdAt: -1 };
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const events = await Event.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            count: events.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res) => {
    try {
        const events = await Event.find({
            isActive: true,
            isFeatured: true,
            date: { $gte: new Date() }
        })
            .sort({ date: 1 })
            .limit(6);

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all events for admin
// @route   GET /api/events/admin/all
// @access  Private/Admin
exports.getAdminEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get event categories
// @route   GET /api/events/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = [
            { value: 'concert', label: 'Concert', icon: '🎵' },
            { value: 'conference', label: 'Conference', icon: '💼' },
            { value: 'workshop', label: 'Workshop', icon: '🔧' },
            { value: 'sports', label: 'Sports', icon: '⚽' },
            { value: 'exhibition', label: 'Exhibition', icon: '🎨' },
            { value: 'theater', label: 'Theater', icon: '🎭' },
            { value: 'festival', label: 'Festival', icon: '🎉' },
            { value: 'other', label: 'Other', icon: '📌' }
        ];

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
