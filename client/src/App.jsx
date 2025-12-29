import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyBookingsPage from './pages/MyBookingsPage';
import NotificationsPage from './pages/NotificationsPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col bg-slate-900">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/events/:id" element={<EventDetailsPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                            {/* Protected Routes */}
                            <Route path="/my-bookings" element={
                                <ProtectedRoute>
                                    <MyBookingsPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/notifications" element={
                                <ProtectedRoute>
                                    <NotificationsPage />
                                </ProtectedRoute>
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path="/admin/events" element={
                                <AdminRoute>
                                    <ManageEventsPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/bookings" element={
                                <AdminRoute>
                                    <ManageBookingsPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/users" element={
                                <AdminRoute>
                                    <ManageUsersPage />
                                </AdminRoute>
                            } />
                        </Routes>
                    </main>
                    <Footer />
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#f1f5f9',
                            border: '1px solid #334155'
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#f1f5f9'
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#f1f5f9'
                            }
                        }
                    }}
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
