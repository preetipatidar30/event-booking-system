import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiUsers,
    FiTag,
    FiUser,
    FiMail,
    FiMinus,
    FiPlus,
    FiCheck,
    FiArrowLeft
} from 'react-icons/fi';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await eventAPI.getById(id);
            setEvent(response.data.event);
        } catch (error) {
            console.error('Error fetching event:', error);
            toast.error('Event not found');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }

        setBooking(true);
        try {
            const response = await bookingAPI.create({
                eventId: event._id,
                quantity
            });

            if (response.data.success) {
                toast.success('Booking confirmed! Check your bookings.');
                setShowBookingModal(false);
                navigate('/my-bookings');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const isEventPast = event && new Date(event.date) < new Date();
    const isEventSoldOut = event && event.availableSeats === 0;
    const canBook = !isEventPast && !isEventSoldOut && event?.isActive;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading event details..." />
            </div>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <FiArrowLeft />
                    <span>Back to Events</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-64 sm:h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                            {/* Category Badge */}
                            <span className="absolute top-4 left-4 px-4 py-2 rounded-full bg-purple-500/80 backdrop-blur-sm text-white font-medium">
                                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                            </span>

                            {/* Status */}
                            {isEventSoldOut && (
                                <span className="absolute top-4 right-4 px-4 py-2 rounded-full bg-red-500/80 backdrop-blur-sm text-white font-medium">
                                    Sold Out
                                </span>
                            )}
                            {isEventPast && (
                                <span className="absolute top-4 right-4 px-4 py-2 rounded-full bg-slate-500/80 backdrop-blur-sm text-white font-medium">
                                    Event Ended
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{event.title}</h1>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-slate-300">
                                    <FiCalendar className="mr-2 text-purple-400" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center text-slate-300">
                                    <FiClock className="mr-2 text-purple-400" />
                                    <span>{event.time} {event.endTime && `- ${event.endTime}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">About This Event</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        {/* Venue */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">Venue Details</h2>
                            <div className="flex items-start space-x-3">
                                <FiMapPin className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-white font-medium">{event.location.venue}</p>
                                    <p className="text-slate-400">
                                        {event.location.address}, {event.location.city}
                                        {event.location.state && `, ${event.location.state}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Organizer */}
                        {event.organizer && (
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Organizer</h2>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <FiUser className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{event.organizer.name}</p>
                                        {event.organizer.email && (
                                            <p className="text-slate-400 text-sm flex items-center">
                                                <FiMail className="mr-1" size={14} />
                                                {event.organizer.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center space-x-1 px-3 py-1 bg-slate-800 rounded-full text-slate-400 text-sm"
                                    >
                                        <FiTag size={12} />
                                        <span>{tag}</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="mb-6">
                                <span className="text-slate-400 text-sm">Price per ticket</span>
                                <p className="text-3xl font-bold text-white">
                                    {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString()}`}
                                </p>
                            </div>

                            {/* Availability */}
                            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 flex items-center">
                                        <FiUsers className="mr-2" />
                                        Available Seats
                                    </span>
                                    <span className={`font-semibold ${event.availableSeats < 50 ? 'text-orange-400' : 'text-green-400'}`}>
                                        {event.availableSeats} / {event.totalSeats}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${event.availableSeats === 0
                                                ? 'bg-red-500'
                                                : event.availableSeats < event.totalSeats * 0.2
                                                    ? 'bg-orange-500'
                                                    : 'bg-green-500'
                                            }`}
                                        style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {canBook ? (
                                <>
                                    {/* Quantity Selector */}
                                    <div className="mb-6">
                                        <label className="block text-slate-400 text-sm mb-2">Number of Tickets</label>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="w-12 h-12 rounded-xl bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-colors"
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(q => Math.min(Math.min(10, event.availableSeats), q + 1))}
                                                className="w-12 h-12 rounded-xl bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-colors"
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="mb-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                                        <div className="flex items-center justify-between">
                                            <span className="text-purple-300">Total Amount</span>
                                            <span className="text-2xl font-bold text-white">
                                                ₹{(event.price * quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => setShowBookingModal(true)}
                                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                                    >
                                        Book Now
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-slate-400">
                                        {isEventSoldOut ? 'This event is sold out' :
                                            isEventPast ? 'This event has ended' :
                                                'Booking is not available'}
                                    </p>
                                </div>
                            )}

                            {/* Features */}
                            <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                                <div className="flex items-center text-slate-400 text-sm">
                                    <FiCheck className="mr-2 text-green-400" />
                                    <span>Instant Confirmation</span>
                                </div>
                                <div className="flex items-center text-slate-400 text-sm">
                                    <FiCheck className="mr-2 text-green-400" />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center text-slate-400 text-sm">
                                    <FiCheck className="mr-2 text-green-400" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Confirm Booking</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Event</span>
                                <span className="text-white font-medium">{event.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Date</span>
                                <span className="text-white">{formatDate(event.date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tickets</span>
                                <span className="text-white">{quantity} x ₹{event.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-slate-700">
                                <span className="text-white font-medium">Total</span>
                                <span className="text-xl font-bold text-purple-400">
                                    ₹{(event.price * quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBooking}
                                disabled={booking}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {booking ? 'Processing...' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailsPage;
