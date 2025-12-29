import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiSearch, FiCalendar, FiMapPin, FiZap, FiArrowRight, FiStar } from 'react-icons/fi';
import { dummyEvents } from '../components/dummy_events';

const HomePage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFeaturedEvents();
    }, []);

    const fetchFeaturedEvents = async () => {
        try {
            const response = await eventAPI.getFeatured();
            setFeaturedEvents(response.data.events);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Use dummy events as fallback when API is unavailable
            setFeaturedEvents(dummyEvents);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/events?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    const categories = [
        { name: 'Concerts', icon: '🎵', color: 'from-pink-500 to-rose-500' },
        { name: 'Conferences', icon: '💼', color: 'from-blue-500 to-cyan-500' },
        { name: 'Workshops', icon: '🔧', color: 'from-green-500 to-emerald-500' },
        { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-amber-500' },
        { name: 'Exhibitions', icon: '🎨', color: 'from-purple-500 to-violet-500' },
        { name: 'Festivals', icon: '🎉', color: 'from-yellow-500 to-orange-500' },
    ];

    const stats = [
        { number: '10K+', label: 'Events Hosted' },
        { number: '500K+', label: 'Tickets Sold' },
        { number: '50K+', label: 'Happy Users' },
        { number: '100+', label: 'Cities Covered' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920')] bg-cover bg-center opacity-10" />

                {/* Animated circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px] opacity-20 animate-pulse-slow" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] opacity-20 animate-pulse-slow" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 animate-fadeIn">
                            Discover Amazing
                            <span className="block gradient-text">Events Near You</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            Find and book tickets for concerts, conferences, workshops, and more. Your next unforgettable experience is just a click away.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                                <div className="relative flex items-center bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700">
                                    <FiSearch className="ml-5 text-slate-400" size={22} />
                                    <input
                                        type="text"
                                        placeholder="Search for events, artists, venues..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 px-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="m-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Quick Links */}
                        <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            <Link to="/events" className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                <FiZap />
                                <span>Trending Events</span>
                            </Link>
                            <Link to="/calendar" className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                <FiCalendar />
                                <span>View Calendar</span>
                            </Link>
                            <Link to="/events?city=Mumbai" className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                                <FiMapPin />
                                <span>Events in Mumbai</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-12 bg-slate-800/30 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.number}</p>
                                <p className="text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Browse by Category</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Explore events based on your interests and find exactly what you're looking for
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/events?category=${category.name.toLowerCase()}`}
                                className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all card-hover text-center"
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl`}>
                                    {category.icon}
                                </div>
                                <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                                    {category.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="py-16 lg:py-24 bg-slate-800/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center space-x-2 text-purple-400 mb-2">
                                <FiStar />
                                <span className="text-sm font-medium uppercase tracking-wider">Featured</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">Upcoming Events</h2>
                        </div>
                        <Link
                            to="/events"
                            className="hidden sm:flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <span>View All Events</span>
                            <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="lg" text="Loading events..." />
                        </div>
                    ) : featuredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEvents.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">No featured events available at the moment.</p>
                            <Link to="/events" className="inline-flex items-center space-x-2 mt-4 text-purple-400 hover:text-purple-300">
                                <span>Browse all events</span>
                                <FiArrowRight />
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-12 sm:hidden">
                        <Link
                            to="/events"
                            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                        >
                            <span>View All Events</span>
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="relative p-8 sm:p-12 rounded-3xl overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920')] bg-cover bg-center opacity-20" />

                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to Experience Something Amazing?
                            </h2>
                            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of event enthusiasts and never miss out on the best experiences in your city.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-slate-100 transition-all"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    to="/events"
                                    className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all"
                                >
                                    Explore Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
