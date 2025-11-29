"use client";

import { format, parseISO, isFuture, isPast, isToday, startOfDay } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function CalendarAgendaView({ 
    events, 
    participantCounts,
    onEventClick,
    getEventColor 
}) {
    // Flatten and sort all events chronologically
    const allEvents = Object.entries(events)
        .flatMap(([date, dayEvents]) => 
            dayEvents.map(event => ({ ...event, date }))
        )
        .sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return (a.time || '').localeCompare(b.time || '');
        });

    // Group by upcoming, today, and past
    const today = format(new Date(), 'yyyy-MM-dd');
    const upcomingEvents = allEvents.filter(e => e.date > today);
    const todayEvents = allEvents.filter(e => e.date === today);
    const pastEvents = allEvents.filter(e => e.date < today).reverse();

    const EventCard = ({ event }) => {
        const eventDate = parseISO(event.date);
        const isPastEvent = isPast(startOfDay(eventDate)) && !isToday(eventDate);
        
        return (
            <div
                onClick={() => onEventClick(event)}
                className={`
                    group bg-white rounded-lg border-l-4 p-4 mb-3 cursor-pointer
                    transition-all hover:shadow-lg hover:-translate-y-1
                    ${getEventColor(event).replace('bg-', 'border-')}
                    ${isPastEvent ? 'opacity-60' : ''}
                `}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-theme-primary transition-colors">
                            {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">
                                    {format(eventDate, 'EEEE, d MMMM yyyy', { locale: ro })}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{event.time}</span>
                            </div>
                        </div>

                        {event.description && (
                            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                                {event.description}
                            </p>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm text-theme-primary font-semibold">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>{participantCounts[event.id] || 0} participanți</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`
                        px-3 py-1 rounded-full text-xs font-bold
                        ${isPastEvent ? 'bg-gray-200 text-gray-600' : 
                          isToday(eventDate) ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'}
                    `}>
                        {isPastEvent ? 'Trecut' : isToday(eventDate) ? 'Astăzi' : 'Viitor'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 rounded-xl p-6 max-h-[700px] overflow-y-auto">
            {/* Today's Events */}
            {todayEvents.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-3xl">🎯</span>
                        Astăzi
                    </h2>
                    {todayEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-3xl">📅</span>
                        Viitoare
                    </h2>
                    {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-600 mb-4 flex items-center gap-2">
                        <span className="text-3xl">📜</span>
                        Trecute
                    </h2>
                    {pastEvents.slice(0, 10).map(event => <EventCard key={event.id} event={event} />)}
                    {pastEvents.length > 10 && (
                        <p className="text-center text-gray-500 text-sm mt-4">
                            Și încă {pastEvents.length - 10} evenimente trecute...
                        </p>
                    )}
                </div>
            )}

            {allEvents.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-gray-600 mb-2">Niciun eveniment</h3>
                    <p className="text-gray-500">Nu există evenimente programate momentan.</p>
                </div>
            )}
        </div>
    );
}