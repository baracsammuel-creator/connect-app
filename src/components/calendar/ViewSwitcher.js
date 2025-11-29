"use client";

export default function ViewSwitcher({ currentView, onViewChange }) {
    const views = [
        { id: 'month', label: 'Lună', icon: '📅' },
        { id: 'week', label: 'Săptămână', icon: '📆' },
        { id: 'agenda', label: 'Agendă', icon: '📋' }
    ];

    return (
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {views.map(view => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
                        ${currentView === view.id 
                            ? 'bg-white text-theme-primary shadow-md' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                    `}
                >
                    <span>{view.icon}</span>
                    <span className="hidden sm:inline">{view.label}</span>
                </button>
            ))}
        </div>
    );
}