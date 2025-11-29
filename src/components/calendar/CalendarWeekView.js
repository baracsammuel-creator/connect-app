"use client";

import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function CalendarWeekView({ 
    currentDate, 
    events, 
    participantCounts,
    onEventClick, 
    onDayClick,
    onEventDragStart,
    onEventDrop,
    getEventColor
}) {
    const weekStart = startOfWeek(currentDate, { locale: ro });
    const weekEnd = endOfWeek(currentDate, { locale: ro });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                <div className="p-3 text-xs font-medium text-gray-500">Ora</div>
                {weekDays.map(day => (
                    <div 
                        key={day.toString()}
                        className={`p-3 text-center cursor-pointer transition-colors ${
                            isToday(day) ? 'bg-theme-primary-light' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onDayClick(day)}
                    >
                        <div className="text-xs font-medium text-gray-500">
                            {format(day, 'EEE', { locale: ro })}
                        </div>
                        <div className={`text-lg font-bold ${
                            isToday(day) ? 'text-theme-primary' : 'text-gray-900'
                        }`}>
                            {format(day, 'd')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time Grid */}
            <div className="overflow-y-auto max-h-[600px]">
                {timeSlots.map(time => (
                    <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                        <div className="p-2 text-xs text-gray-500 font-medium border-r border-gray-200">
                            {time}
                        </div>
                        {weekDays.map(day => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const dayEvents = events[dateKey] || [];
                            const eventsAtTime = dayEvents.filter(e => e.time?.startsWith(time.slice(0, 2)));

                            return (
                                <div 
                                    key={`${day}-${time}`}
                                    className="p-1 min-h-[60px] border-r border-gray-100 hover:bg-gray-50 transition-colors"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onEventDrop(e, dateKey, time)}
                                >
                                    {eventsAtTime.map(event => (
                                        <div
                                            key={event.id}
                                            draggable
                                            onDragStart={(e) => onEventDragStart(e, event)}
                                            onClick={() => onEventClick(event)}
                                            className={`
                                                ${getEventColor(event)} 
                                                text-white text-xs p-2 rounded mb-1 cursor-pointer
                                                hover:shadow-md transition-all hover:scale-105
                                            `}
                                        >
                                            <div className="font-semibold truncate">{event.title}</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                </svg>
                                                <span>{participantCounts[event.id] || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}