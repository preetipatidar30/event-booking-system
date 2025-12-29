const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const dummyEvents = [
    {
        title: "Sunburn Music Festival 2026",
        description: "India's biggest electronic dance music festival featuring world-class DJs and artists. Experience an unforgettable night of music, lights, and energy!",
        category: "concert",
        date: new Date("2026-02-15"),
        time: "6:00 PM",
        endTime: "11:00 PM",
        location: {
            venue: "DY Patil Stadium",
            address: "Nerul, Navi Mumbai",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India"
        },
        price: 2999,
        totalSeats: 5000,
        availableSeats: 3500,
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        organizer: {
            name: "Sunburn Events",
            email: "info@sunburn.in",
            phone: "+91 9876543210"
        },
        isActive: true,
        isFeatured: true,
        tags: ["music", "edm", "festival"]
    },
    {
        title: "AI & Web Development Conference 2026",
        description: "Join industry leaders and experts for a deep dive into the latest trends in AI, machine learning, and modern web development technologies.",
        category: "conference",
        date: new Date("2026-03-10"),
        time: "9:30 AM",
        endTime: "5:00 PM",
        location: {
            venue: "Bangalore International Exhibition Centre",
            address: "10th Mile, Tumkur Road",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        price: 1499,
        totalSeats: 800,
        availableSeats: 450,
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
        organizer: {
            name: "Tech Conferences India",
            email: "info@techconf.in",
            phone: "+91 9876543211"
        },
        isActive: true,
        isFeatured: true,
        tags: ["ai", "web development", "technology"]
    },
    {
        title: "React & MERN Stack Workshop",
        description: "Hands-on workshop covering React, Node.js, Express, and MongoDB. Build a full-stack application from scratch!",
        category: "workshop",
        date: new Date("2026-01-25"),
        time: "10:00 AM",
        endTime: "4:00 PM",
        location: {
            venue: "Tech Hub Indore",
            address: "Vijay Nagar",
            city: "Indore",
            state: "Madhya Pradesh",
            country: "India"
        },
        price: 999,
        totalSeats: 100,
        availableSeats: 35,
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        organizer: {
            name: "Code Academy Indore",
            email: "learn@codeacademy.in",
            phone: "+91 9876543212"
        },
        isActive: true,
        isFeatured: true,
        tags: ["react", "mern", "javascript", "workshop"]
    },
    {
        title: "Startup Networking Meetup",
        description: "Connect with fellow entrepreneurs, investors, and mentors. Share ideas, find co-founders, and grow your network!",
        category: "other",
        date: new Date("2026-01-18"),
        time: "5:00 PM",
        endTime: "8:00 PM",
        location: {
            venue: "WeWork Innovation Hub",
            address: "Connaught Place",
            city: "Delhi",
            state: "Delhi",
            country: "India"
        },
        price: 0,
        totalSeats: 200,
        availableSeats: 150,
        imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
        organizer: {
            name: "Startup India Network",
            email: "connect@startupindia.net",
            phone: "+91 9876543213"
        },
        isActive: true,
        isFeatured: false,
        tags: ["startup", "networking", "entrepreneurs"]
    },
    {
        title: "IPL 2026 Final",
        description: "Witness the thrilling finale of IPL 2026! The best teams battle it out for the championship trophy.",
        category: "sports",
        date: new Date("2026-05-25"),
        time: "7:30 PM",
        endTime: "11:30 PM",
        location: {
            venue: "Narendra Modi Stadium",
            address: "Motera",
            city: "Ahmedabad",
            state: "Gujarat",
            country: "India"
        },
        price: 4999,
        totalSeats: 50000,
        availableSeats: 12000,
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        organizer: {
            name: "BCCI",
            email: "tickets@bcci.tv",
            phone: "+91 9876543214"
        },
        isActive: true,
        isFeatured: true,
        tags: ["cricket", "ipl", "sports"]
    },
    {
        title: "Stand-up Comedy Night with Zakir Khan",
        description: "Get ready for a night full of laughter with India's favorite stand-up comedian Zakir Khan!",
        category: "theater",
        date: new Date("2026-02-08"),
        time: "8:00 PM",
        endTime: "10:00 PM",
        location: {
            venue: "Phoenix Marketcity",
            address: "Kurla West",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India"
        },
        price: 1299,
        totalSeats: 500,
        availableSeats: 120,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
        organizer: {
            name: "Laugh Club India",
            email: "book@laughclub.in",
            phone: "+91 9876543215"
        },
        isActive: true,
        isFeatured: true,
        tags: ["comedy", "standup", "entertainment"]
    },
    {
        title: "Holi Music Festival",
        description: "Celebrate the festival of colors with amazing music, rain dance, and organic colors!",
        category: "festival",
        date: new Date("2026-03-14"),
        time: "10:00 AM",
        endTime: "6:00 PM",
        location: {
            venue: "Jawaharlal Nehru Stadium",
            address: "Lodhi Road",
            city: "Delhi",
            state: "Delhi",
            country: "India"
        },
        price: 799,
        totalSeats: 10000,
        availableSeats: 6000,
        imageUrl: "https://images.unsplash.com/photo-1576098539498-75cf8f97e9c8?w=800",
        organizer: {
            name: "Festival Events Delhi",
            email: "events@festivaldel.in",
            phone: "+91 9876543216"
        },
        isActive: true,
        isFeatured: false,
        tags: ["holi", "festival", "music"]
    },
    {
        title: "Digital Art Exhibition",
        description: "Explore stunning digital artworks and NFT collections from artists around the world.",
        category: "exhibition",
        date: new Date("2026-02-01"),
        time: "11:00 AM",
        endTime: "7:00 PM",
        location: {
            venue: "National Gallery of Modern Art",
            address: "Jaipur House",
            city: "Delhi",
            state: "Delhi",
            country: "India"
        },
        price: 299,
        totalSeats: 300,
        availableSeats: 200,
        imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        organizer: {
            name: "Digital Arts India",
            email: "gallery@digitalarts.in",
            phone: "+91 9876543217"
        },
        isActive: true,
        isFeatured: false,
        tags: ["art", "digital", "nft", "exhibition"]
    }
];

// @route   POST /api/seed
// @access  Public (for development only)
router.post('/', async (req, res) => {
    try {
        // Find or create an admin user
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@eventmanagement.com',
                password: 'admin123456',
                role: 'admin'
            });
            console.log('Created admin user:', adminUser.email);
        }

        // Clear existing events
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Add createdBy field to all events
        const eventsWithCreator = dummyEvents.map(event => ({
            ...event,
            createdBy: adminUser._id
        }));

        // Insert dummy events
        const result = await Event.insertMany(eventsWithCreator);

        res.status(201).json({
            success: true,
            message: `Successfully added ${result.length} events!`,
            count: result.length,
            events: result.map(e => ({ title: e.title, category: e.category, isFeatured: e.isFeatured }))
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
