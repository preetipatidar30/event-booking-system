import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiMenu,
    FiX,
    FiUser,
    FiLogOut,
    FiCalendar,
    FiGrid,
    FiBell,
    FiHome,
    FiList
} from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowDropdown(false);
    };

    return (
        <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-white">EventBook</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/"
                            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <FiHome size={18} />
                            <span>Home</span>
                        </Link>
                        <Link
                            to="/events"
                            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <FiList size={18} />
                            <span>Events</span>
                        </Link>
                        <Link
                            to="/calendar"
                            className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <FiCalendar size={18} />
                            <span>Calendar</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/my-bookings"
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <FiGrid size={18} />
                                    <span>My Bookings</span>
                                </Link>
                                <Link
                                    to="/notifications"
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <FiBell size={18} />
                                    <span>Notifications</span>
                                </Link>

                                {isAdmin() && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-1 px-4 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-slate-800 transition-all"
                                    >
                                        <FiGrid size={18} />
                                        <span>Admin</span>
                                    </Link>
                                )}

                                {/* User Dropdown */}
                                <div className="relative ml-2">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-white">{user?.name}</span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2">
                                            <div className="px-4 py-2 border-b border-slate-700">
                                                <p className="text-sm text-slate-400">Signed in as</p>
                                                <p className="text-white font-medium truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-400 hover:bg-slate-700 transition-all"
                                            >
                                                <FiLogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 ml-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg text-white hover:bg-slate-800 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-slate-800">
                        <div className="flex flex-col space-y-2">
                            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                <FiHome size={20} />
                                <span>Home</span>
                            </Link>
                            <Link to="/events" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                <FiList size={20} />
                                <span>Events</span>
                            </Link>
                            <Link to="/calendar" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                <FiCalendar size={20} />
                                <span>Calendar</span>
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                        <FiGrid size={20} />
                                        <span>My Bookings</span>
                                    </Link>
                                    <Link to="/notifications" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                        <FiBell size={20} />
                                        <span>Notifications</span>
                                    </Link>
                                    {isAdmin() && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 rounded-lg text-purple-400 hover:bg-slate-800">
                                            <FiGrid size={20} />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="flex items-center space-x-2 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800"
                                    >
                                        <FiLogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-slate-800">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center rounded-lg text-white hover:bg-slate-800">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="mx-4 py-3 text-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
