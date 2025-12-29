import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiTag,
    FiX,
    FiCheck,
    FiAlertCircle
} from 'react-icons/fi';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getMyBookings();
            setBookings(response.data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        setCancelling(bookingId);
        try {
            await bookingAPI.cancel(bookingId);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelling(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/20 text-green-400';
            case 'cancelled': return 'bg-red-500/20 text-red-400';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-slate-500/20 text-slate-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FiCheck />;
            case 'cancelled': return <FiX />;
            case 'pending': return <FiAlertCircle />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading your bookings..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
                    <p className="text-slate-400">Manage your event bookings and tickets</p>
                </div>

                {bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Event Image */}
                                    <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                                        <img
                                            src={booking.event?.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                                            alt={booking.event?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                                                        {getStatusIcon(booking.bookingStatus)}
                                                        <span>{booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}</span>
                                                    </span>
                                                    <span className="text-slate-500 text-sm">
                                                        #{booking.ticketCode}
                                                    </span>
                                                </div>

                                                <Link to={`/events/${booking.event?._id}`}>
                                                    <h3 className="text-lg font-semibold text-white hover:text-purple-400 transition-colors mb-2">
                                                        {booking.event?.title || 'Event Unavailable'}
                                                    </h3>
                                                </Link>

                                                <div className="space-y-1 text-sm text-slate-400">
                                                    <div className="flex items-center">
                                                        <FiCalendar className="mr-2 flex-shrink-0" />
                                                        <span>{formatDate(booking.event?.date)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiClock className="mr-2 flex-shrink-0" />
                                                        <span>{booking.event?.time}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FiMapPin className="mr-2 flex-shrink-0" />
                                                        <span>{booking.event?.location?.venue}, {booking.event?.location?.city}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="text-right">
                                                <div className="mb-2">
                                                    <span className="text-slate-400 text-sm">Tickets: {booking.quantity}</span>
                                                    <p className="text-xl font-bold text-white">
                                                        ₹{booking.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>

                                                {booking.bookingStatus === 'confirmed' && new Date(booking.event?.date) > new Date() && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        disabled={cancelling === booking._id}
                                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 text-sm"
                                                    >
                                                        {cancelling === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
                        <p className="text-slate-400 mb-6">Start exploring events and book your first ticket!</p>
                        <Link
                            to="/events"
                            className="inline-flex px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                        >
                            Browse Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
