"use client";

import { useState, useEffect } from 'react';

export default function EventPreviewTooltip({ event, participantCount, position, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay for smooth appearance
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!event) return null;

    return (
        <div 
            className={`
                fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72
                transition-all duration-200 transform
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseEnter={onClose}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-lg leading-tight pr-2">
                    {event.title}
                </h3>
                <span className="text-2xl flex-shrink-0">⏰</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{event.time}</span>
            </div>

            {/* Description */}
            {event.description && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {event.description}
                </p>
            )}

            {/* Participants */}
            <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold text-theme-primary">
                    {participantCount || 0} {participantCount === 1 ? 'participant' : 'participanți'}
                </span>
            </div>

            {/* Hover tip */}
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 italic">
                Click pentru mai multe detalii
            </div>
        </div>
    );
}