const express = require('express');
const router = express.Router();
const {
    getEvents,
    getFeaturedEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getAdminEvents,
    getCategories
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/categories', getCategories);
router.get('/:id', getEvent);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminEvents);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
