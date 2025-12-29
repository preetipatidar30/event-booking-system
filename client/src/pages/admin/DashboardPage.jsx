import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, eventAPI, authAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
    FiCalendar,
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiList,
    FiShoppingBag,
    FiUserCheck,
    FiArrowRight
} from 'react-icons/fi';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, bookingsRes, eventsRes, usersRes] = await Promise.all([
                bookingAPI.getStats(),
                bookingAPI.getAll(),
                eventAPI.getAdminAll(),
                authAPI.getAllUsers()
            ]);

            setStats({
                ...statsRes.data.stats,
                totalEvents: eventsRes.data.count,
                totalUsers: usersRes.data.count
            });
            setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: FiDollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10'
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: FiShoppingBag,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10'
        },
        {
            title: 'Total Events',
            value: stats?.totalEvents || 0,
            icon: FiCalendar,
            color: 'from-purple-500 to-indigo-600',
            bgColor: 'bg-purple-500/10'
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: FiUsers,
            color: 'from-orange-500 to-amber-600',
            bgColor: 'bg-orange-500/10'
        }
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Welcome back! Here's what's happening with your events.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`text-xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                                </div>
                                <FiTrendingUp className="text-green-400" />
                            </div>
                            <p className="text-slate-400 text-sm mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/admin/events"
                        className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <FiList className="text-purple-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Events</p>
                                <p className="text-slate-400 text-sm">Create, edit, or delete events</p>
                            </div>
                        </div>
                        <FiArrowRight className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FiShoppingBag className="text-blue-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Bookings</p>
                                <p className="text-slate-400 text-sm">View and manage bookings</p>
                            </div>
                        </div>
                        <FiArrowRight className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                    </Link>

                    <Link
                        to="/admin/users"
                        className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <FiUserCheck className="text-green-400 text-xl" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Manage Users</p>
                                <p className="text-slate-400 text-sm">View and manage users</p>
                            </div>
                        </div>
                        <FiArrowRight className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                    </Link>
                </div>

                {/* Recent Bookings */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-700">
                        <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                        <Link to="/admin/bookings" className="text-purple-400 hover:text-purple-300 text-sm">
                            View All
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Booking
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-slate-700/30">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-300 text-sm font-mono">
                                                    {booking.ticketCode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white text-sm">
                                                    {booking.event?.title?.slice(0, 30)}...
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-300 text-sm">
                                                    {booking.user?.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-white font-medium">
                                                    ₹{booking.totalAmount.toLocaleString()}
                                                </span>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-slate-400">No bookings yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
