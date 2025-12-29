const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@eventbooking.com',
            password: 'admin123',
            role: 'admin',
            phone: '+91 9876543210'
        });
        console.log('Admin user created');

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'user@test.com',
            password: 'user123',
            role: 'user',
            phone: '+91 9876543211'
        });
        console.log('Test user created');

        // Create sample events
        const events = [
            {
                title: 'Tech Conference 2025',
                description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Learn about AI, Cloud Computing, Web3, and more!',
                category: 'conference',
                date: new Date('2025-02-15'),
                time: '09:00',
                endTime: '18:00',
                location: {
                    venue: 'Bangalore International Exhibition Centre',
                    address: '10th Mile, Tumkur Road',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'India'
                },
                totalSeats: 500,
                price: 2999,
                imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                organizer: { name: 'TechEvents India', email: 'info@techevents.in' },
                createdBy: admin._id,
                isFeatured: true,
                tags: ['technology', 'AI', 'networking']
            },
            {
                title: 'Arijit Singh Live Concert',
                description: 'Experience the magic of Arijit Singh live in concert. An evening filled with soulful melodies and unforgettable performances of your favorite Bollywood hits.',
                category: 'concert',
                date: new Date('2025-01-20'),
                time: '19:00',
                endTime: '23:00',
                location: {
                    venue: 'DY Patil Stadium',
                    address: 'Nerul, Navi Mumbai',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India'
                },
                totalSeats: 25000,
                price: 1499,
                imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
                organizer: { name: 'BookMyShow Live', email: 'live@bookmyshow.com' },
                createdBy: admin._id,
                isFeatured: true,
                tags: ['music', 'concert', 'bollywood']
            },
            {
                title: 'Digital Marketing Workshop',
                description: 'A comprehensive 2-day workshop covering SEO, Social Media Marketing, Google Ads, Content Marketing, and Analytics. Perfect for beginners and intermediate marketers.',
                category: 'workshop',
                date: new Date('2025-01-25'),
                time: '10:00',
                endTime: '17:00',
                location: {
                    venue: 'Regus Business Centre',
                    address: 'Cyber City, DLF Phase 2',
                    city: 'Gurugram',
                    state: 'Haryana',
                    country: 'India'
                },
                totalSeats: 50,
                price: 4999,
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
                organizer: { name: 'Digital Academy', email: 'info@digitalacademy.in' },
                createdBy: admin._id,
                isFeatured: true,
                tags: ['marketing', 'digital', 'workshop']
            },
            {
                title: 'IPL 2025 - MI vs CSK',
                description: 'Watch the epic rivalry between Mumbai Indians and Chennai Super Kings live at Wankhede Stadium. Experience the thrill of IPL cricket!',
                category: 'sports',
                date: new Date('2025-04-10'),
                time: '19:30',
                endTime: '23:30',
                location: {
                    venue: 'Wankhede Stadium',
                    address: 'Marine Drive',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    country: 'India'
                },
                totalSeats: 33000,
                price: 999,
                imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
                organizer: { name: 'BCCI', email: 'tickets@iplt20.com' },
                createdBy: admin._id,
                isFeatured: true,
                tags: ['cricket', 'IPL', 'sports']
            },
            {
                title: 'Art Exhibition - Modern Masters',
                description: 'Explore contemporary art from renowned Indian and international artists. Features paintings, sculptures, and digital art installations.',
                category: 'exhibition',
                date: new Date('2025-02-01'),
                time: '11:00',
                endTime: '20:00',
                location: {
                    venue: 'National Gallery of Modern Art',
                    address: 'Jaipur House, India Gate',
                    city: 'New Delhi',
                    state: 'Delhi',
                    country: 'India'
                },
                totalSeats: 200,
                price: 299,
                imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
                organizer: { name: 'NGMA', email: 'info@ngma.gov.in' },
                createdBy: admin._id,
                isFeatured: false,
                tags: ['art', 'exhibition', 'culture']
            },
            {
                title: 'Hamlet - Theater Play',
                description: 'A stunning modern adaptation of Shakespeare\'s Hamlet performed by the National School of Drama repertory. A must-watch for theater enthusiasts.',
                category: 'theater',
                date: new Date('2025-01-30'),
                time: '18:30',
                endTime: '21:30',
                location: {
                    venue: 'Kamani Auditorium',
                    address: 'Copernicus Marg',
                    city: 'New Delhi',
                    state: 'Delhi',
                    country: 'India'
                },
                totalSeats: 600,
                price: 799,
                imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
                organizer: { name: 'NSD', email: 'tickets@nsd.gov.in' },
                createdBy: admin._id,
                isFeatured: false,
                tags: ['theater', 'drama', 'shakespeare']
            },
            {
                title: 'Holi Music Festival 2025',
                description: 'Celebrate Holi with music, colors, and dance! Featuring performances by top DJs and artists. Rain dance, organic colors, and food stalls included.',
                category: 'festival',
                date: new Date('2025-03-14'),
                time: '10:00',
                endTime: '18:00',
                location: {
                    venue: 'JLN Stadium Grounds',
                    address: 'Lodhi Road',
                    city: 'New Delhi',
                    state: 'Delhi',
                    country: 'India'
                },
                totalSeats: 10000,
                price: 1999,
                imageUrl: 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?w=800',
                organizer: { name: 'Sunburn Events', email: 'info@sunburn.in' },
                createdBy: admin._id,
                isFeatured: true,
                tags: ['festival', 'holi', 'music', 'party']
            },
            {
                title: 'Startup Pitch Competition',
                description: 'Watch 20 innovative startups pitch their ideas to top VCs. Networking session and investor meet included. Great opportunity for entrepreneurs!',
                category: 'conference',
                date: new Date('2025-02-20'),
                time: '14:00',
                endTime: '19:00',
                location: {
                    venue: 'ITC Grand Chola',
                    address: 'Mount Road, Guindy',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    country: 'India'
                },
                totalSeats: 300,
                price: 999,
                imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
                organizer: { name: 'Startup India', email: 'events@startupindia.gov.in' },
                createdBy: admin._id,
                isFeatured: false,
                tags: ['startup', 'business', 'investment']
            }
        ];

        await Event.insertMany(events);
        console.log(`${events.length} events created`);

        console.log('\n========================================');
        console.log('SEED DATA COMPLETE!');
        console.log('========================================');
        console.log('\nAdmin Login:');
        console.log('Email: admin@eventbooking.com');
        console.log('Password: admin123');
        console.log('\nUser Login:');
        console.log('Email: user@test.com');
        console.log('Password: user123');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
