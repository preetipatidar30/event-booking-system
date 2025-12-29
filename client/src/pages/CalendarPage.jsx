import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiCalendar, FiInfo } from 'react-icons/fi';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchMyBookings();
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, []);

    const fetchMyBookings = async () => {
        try {
            const response = await bookingAPI.getMyBookings();
            const calendarEvents = response.data.bookings
                .filter(booking => booking.bookingStatus === 'confirmed' && booking.event)
                .map(booking => ({
                    id: booking._id,
                    title: booking.event.title,
                    start: booking.event.date,
                    backgroundColor: getCategoryColor(booking.event.category),
                    borderColor: getCategoryColor(booking.event.category),
                    extendedProps: {
                        eventId: booking.event._id,
                        category: booking.event.category,
                        price: booking.event.price,
                        venue: booking.event.location?.venue,
                        quantity: booking.quantity,
                        ticketCode: booking.ticketCode,
                        totalAmount: booking.totalAmount
                    }
                }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            concert: '#ec4899',
            conference: '#3b82f6',
            workshop: '#22c55e',
            sports: '#f97316',
            exhibition: '#a855f7',
            theater: '#ef4444',
            festival: '#eab308',
            other: '#64748b'
        };
        return colors[category] || colors.other;
    };

    const handleEventClick = (info) => {
        // Navigate to event details page
        const eventId = info.event.extendedProps.eventId;
        if (eventId) {
            navigate(`/events/${eventId}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading your booked events..." />
            </div>
        );
    }

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <FiCalendar className="mx-auto text-6xl text-slate-500 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">View Your Booked Events</h2>
                        <p className="text-slate-400 mb-8">Please login to see your booked events in the calendar.</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                        >
                            Login to Continue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Booked Events</h1>
                    <p className="text-slate-400">View all your confirmed bookings in calendar format</p>
                </div>

                {/* Info Banner */}
                <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 mb-8">
                    <FiInfo className="text-purple-400 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-slate-300 text-sm">
                            This calendar shows only <strong className="text-white">your booked events</strong>.
                            Click on any event to view its details.
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {[
                        { name: 'Concert', color: '#ec4899' },
                        { name: 'Conference', color: '#3b82f6' },
                        { name: 'Workshop', color: '#22c55e' },
                        { name: 'Sports', color: '#f97316' },
                        { name: 'Exhibition', color: '#a855f7' },
                        { name: 'Theater', color: '#ef4444' },
                        { name: 'Festival', color: '#eab308' },
                    ].map(item => (
                        <div key={item.name} className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-400">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar */}
                <div className="bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-700">
                    <style>{`
            .fc {
              --fc-border-color: #334155;
              --fc-button-bg-color: #475569;
              --fc-button-border-color: #475569;
              --fc-button-hover-bg-color: #64748b;
              --fc-button-hover-border-color: #64748b;
              --fc-button-active-bg-color: #7c3aed;
              --fc-button-active-border-color: #7c3aed;
              --fc-today-bg-color: rgba(124, 58, 237, 0.1);
              --fc-page-bg-color: transparent;
              --fc-neutral-bg-color: #1e293b;
              --fc-list-event-hover-bg-color: #334155;
            }
            .fc .fc-toolbar-title {
              color: white;
              font-size: 1.25rem;
            }
            .fc .fc-col-header-cell-cushion,
            .fc .fc-daygrid-day-number {
              color: #94a3b8;
            }
            .fc .fc-daygrid-day.fc-day-today {
              background-color: rgba(124, 58, 237, 0.1);
            }
            .fc .fc-event {
              cursor: pointer;
              border-radius: 4px;
              padding: 2px 4px;
              font-size: 0.75rem;
            }
            .fc .fc-event:hover {
              opacity: 0.8;
            }
            .fc .fc-button {
              font-weight: 500;
            }
            .fc-theme-standard td, .fc-theme-standard th {
              border-color: #334155;
            }
          `}</style>

                    {events.length > 0 ? (
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate="2026-01-01"
                            events={events}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            height="auto"
                            eventDisplay="block"
                            dayMaxEvents={3}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <FiCalendar className="mx-auto text-5xl text-slate-500 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Booked Events</h3>
                            <p className="text-slate-400 mb-6">You haven't booked any events yet.</p>
                            <Link
                                to="/events"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-all"
                            >
                                Browse Events
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
