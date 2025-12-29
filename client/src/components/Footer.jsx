import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <span className="text-xl font-bold text-white">EventBook</span>
                        </Link>
                        <p className="text-slate-400 mb-4 max-w-sm">
                            Your one-stop platform for discovering and booking amazing events. From concerts to conferences, we've got you covered.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                                <FiLinkedin size={20} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">
                                <FiGithub size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/events" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/calendar" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Event Calendar
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-bookings" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-slate-400 hover:text-purple-400 transition-colors">
                                    Create Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-2 text-slate-400">
                                <FiMail size={16} />
                                <span>support@eventbook.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-slate-400">
                                <FiPhone size={16} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-2 text-slate-400">
                                <FiMapPin size={16} />
                                <span>Bangalore, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} EventBook. All rights reserved. Made with ❤️ for College Assignment.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
