const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide event category'],
        enum: ['concert', 'conference', 'workshop', 'sports', 'exhibition', 'theater', 'festival', 'other']
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide event time']
    },
    endTime: {
        type: String,
        default: ''
    },
    location: {
        venue: {
            type: String,
            required: [true, 'Please provide venue name']
        },
        address: {
            type: String,
            required: [true, 'Please provide address']
        },
        city: {
            type: String,
            required: [true, 'Please provide city']
        },
        state: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: 'India'
        }
    },
    totalSeats: {
        type: Number,
        required: [true, 'Please provide total seats'],
        min: [1, 'Total seats must be at least 1']
    },
    availableSeats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide ticket price'],
        min: [0, 'Price cannot be negative']
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
    },
    organizer: {
        name: {
            type: String,
            default: 'Event Organizer'
        },
        email: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    bookingDeadline: {
        type: Date
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Index for searching
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.city': 1 });

// Set available seats before saving new event
eventSchema.pre('save', function (next) {
    if (this.isNew) {
        this.availableSeats = this.totalSeats;
    }
    if (!this.bookingDeadline) {
        this.bookingDeadline = this.date;
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
