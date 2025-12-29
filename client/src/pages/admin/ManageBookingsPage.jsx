import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSearch, FiXCircle, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getAll();
            setBookings(response.data.bookings);
            setStats(response.data.stats);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This will refund the user.')) return;

        try {
            await bookingAPI.cancel(bookingId);
            toast.success('Booking cancelled and refunded');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || booking.bookingStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading bookings..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Manage Bookings</h1>
                    <p className="text-slate-400">View and manage all event bookings</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <FiDollarSign className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Revenue</p>
                                <p className="text-xl font-bold text-white">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <FiTrendingUp className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Confirmed</p>
                                <p className="text-xl font-bold text-white">{stats.confirmedBookings || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <FiXCircle className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Cancelled</p>
                                <p className="text-xl font-bold text-white">{stats.cancelledBookings || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ticket code, user, or event..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Bookings Table */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Ticket Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Event</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Qty</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-300 font-mono text-sm">{booking.ticketCode}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white text-sm line-clamp-1">{booking.event?.title}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-white text-sm">{booking.user?.name}</p>
                                            <p className="text-slate-500 text-xs">{booking.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-300">{booking.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white font-medium">₹{booking.totalAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-slate-400 text-sm">{formatDate(booking.createdAt)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.bookingStatus === 'confirmed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : booking.bookingStatus === 'cancelled'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {booking.bookingStatus === 'confirmed' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Cancel & Refund
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-slate-400">No bookings found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBookingsPage;
