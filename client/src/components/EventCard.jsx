import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiTag } from 'react-icons/fi';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            concert: 'bg-pink-500/20 text-pink-400',
            conference: 'bg-blue-500/20 text-blue-400',
            workshop: 'bg-green-500/20 text-green-400',
            sports: 'bg-orange-500/20 text-orange-400',
            exhibition: 'bg-purple-500/20 text-purple-400',
            theater: 'bg-red-500/20 text-red-400',
            festival: 'bg-yellow-500/20 text-yellow-400',
            other: 'bg-slate-500/20 text-slate-400'
        };
        return colors[category] || colors.other;
    };

    const isEventSoldOut = event.availableSeats === 0;
    const isEventPast = new Date(event.date) < new Date();

    return (
        <Link to={`/events/${event._id}`}>
            <div className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 card-hover">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                    {/* Category Badge */}
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>

                    {/* Status Badge */}
                    {isEventSoldOut && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                            Sold Out
                        </span>
                    )}
                    {isEventPast && !isEventSoldOut && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">
                            Past Event
                        </span>
                    )}

                    {/* Price */}
                    <div className="absolute bottom-4 right-4">
                        <span className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-sm text-white font-bold">
                            {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString()}`}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                        {event.title}
                    </h3>

                    <div className="space-y-2">
                        <div className="flex items-center text-slate-400 text-sm">
                            <FiCalendar className="mr-2 flex-shrink-0" />
                            <span>{formatDate(event.date)} at {event.time}</span>
                        </div>

                        <div className="flex items-center text-slate-400 text-sm">
                            <FiMapPin className="mr-2 flex-shrink-0" />
                            <span className="truncate">{event.location?.venue}, {event.location?.city}</span>
                        </div>

                        <div className="flex items-center text-slate-400 text-sm">
                            <FiUsers className="mr-2 flex-shrink-0" />
                            <span>
                                {event.availableSeats} / {event.totalSeats} seats available
                            </span>
                        </div>
                    </div>

                    {/* Availability Bar */}
                    <div className="mt-4">
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${event.availableSeats === 0
                                        ? 'bg-red-500'
                                        : event.availableSeats < event.totalSeats * 0.2
                                            ? 'bg-orange-500'
                                            : 'bg-green-500'
                                    }`}
                                style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
