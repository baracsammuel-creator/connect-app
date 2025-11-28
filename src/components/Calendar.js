"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay,
    addMonths,
    subMonths,
    parseISO, 
    startOfDay, 
} from 'date-fns';
import { ro } from 'date-fns/locale'; 

import { 
    onSnapshot, 
    query, 
    eventsCollectionRef, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    dbInitialized 
} from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext'; 

// --- Componenta Modală pentru Formularul de Eveniment (Editare/Creare) ---
const EventFormModal = ({ selectedDate, eventToEdit, onClose, onSave, onDelete, currentUserId }) => {
    const isEditing = !!eventToEdit;
    
    const [title, setTitle] = useState(eventToEdit?.title || '');
    const [description, setDescription] = useState(eventToEdit?.description || '');
    const [eventTime, setEventTime] = useState(eventToEdit?.time || format(new Date(), 'HH:mm')); 
    const [error, setError] = useState('');
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    // Data afișată în modal
    const displayDate = isEditing 
        ? parseISO(eventToEdit.date).toLocaleDateString('ro-RO')
        : selectedDate.toLocaleDateString('ro-RO');

    // Verifică dacă utilizatorul curent este creatorul evenimentului de editat
    const canDelete = isEditing && (eventToEdit.createdBy === currentUserId || eventToEdit.role === 'admin' || eventToEdit.role === 'lider');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) {
            setError("Titlul evenimentului nu poate fi gol.");
            return;
        }
        if (!eventTime) {
            setError("Vă rugăm să selectați o oră.");
            return;
        }

        const data = {
            title,
            description,
            date: eventToEdit?.date || format(selectedDate, 'yyyy-MM-dd'), 
            time: eventTime, 
        };

        try {
            if (isEditing) {
                // Dacă e editare, trimitem ID-ul și datele
                await onSave(eventToEdit.id, data);
            } else {
                // Dacă e creare, trimitem doar datele
                await onSave(data);
            }
            onClose();
        } catch (err) {
            console.error(`Eroare la ${isEditing ? 'actualizarea' : 'adăugarea'} evenimentului:`, err);
            // Afișăm eroarea primită de la Firestore pentru a ajuta la depanare
            setError(`A apărut o eroare la salvare: ${err.message}. Încercați din nou. Dacă eroarea persistă, verificați Regulile de Securitate Firestore.`);
        }
    };
    
    // Funcție pentru ștergere cu confirmare
    const handleDelete = async () => {
        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }
        
        try {
            if (eventToEdit?.id) {
                await onDelete(eventToEdit.id);
                onClose();
            }
        } catch (err) {
            console.error("Eroare la ștergerea evenimentului:", err);
            setError(`A apărut o eroare la ștergere: ${err.message}.`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                
                {/* Butonul de Închidere (X) în colțul din dreapta sus */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition focus:outline-none"
                    aria-label="Închide"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                    {isEditing ? 'Modifică Eveniment' : 'Creare Eveniment Nou'}
                </h2>
                <p className="mb-4 text-gray-700">Data evenimentului: <span className="font-semibold">{displayDate}</span></p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titlu</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Oră</label>
                        <input
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descriere (Opțional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-md border border-red-200">{error}</p>}

                    <div className="flex justify-between items-center mt-6">
                        {/* Se afișează butonul de ștergere doar dacă utilizatorul poate șterge */}
                        {isEditing && canDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition shadow-md ${
                                    isConfirmingDelete 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                            >
                                {isConfirmingDelete ? 'CONFIRMĂ ȘTERGEREA?' : 'Șterge Eveniment'}
                            </button>
                        )}
                        <div className={`flex space-x-3 ${!isEditing || !canDelete ? 'w-full justify-end' : 'ml-auto'}`}>
                            {/* Butonul de ANULARE este ELIMINAT, se folosește 'X'-ul de închidere */}
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md"
                            >
                                {isEditing ? 'Salvează Modificările' : 'Salvează Eveniment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componenta Principală Calendar ---

export default function Calendar() {
    const { user, loading, role } = useAuth(); // Extragem user (cu uid) și role
    const today = new Date();
    
    // Starea pentru luna afișată
    const [currentMonth, setCurrentMonth] = useState(today); 
    
    // Starea pentru ziua pe care a dat clic utilizatorul (selectată)
    const [selectedDate, setSelectedDate] = useState(today); 
    
    // Stochează evenimentele sub formă { 'YYYY-MM-DD': [event1, event2] }
    const [events, setEvents] = useState({}); 
    const [modalState, setModalState] = useState({
        isOpen: false,
        eventToEdit: null, // Null pentru creare, obiect eveniment pentru editare
        selectedDateForNew: null, // Data pentru un eveniment nou
    });
    const [isFetching, setIsFetching] = useState(true);

    // NOU: Calculăm dacă ziua selectată este în trecut
    const isPastDate = useMemo(() => {
        // Compară doar ziua, ignorând ora
        const todayStart = startOfDay(new Date());
        const selectedDayStart = startOfDay(selectedDate);
        // Dacă ziua selectată este strict înainte de începutul zilei de azi
        return selectedDayStart < todayStart; 
    }, [selectedDate]); 


    // Funcție pentru a genera zilele din grila calendarului (42 de zile)
    const generateCalendarDays = (month) => {
        // Începem de la începutul săptămânii care conține prima zi a lunii
        const monthStart = startOfMonth(month);
        const startDay = startOfWeek(monthStart, { locale: ro }); 
        
        // Sfârșitul săptămânii care conține ultima zi a lunii
        const monthEnd = endOfMonth(month);
        const endDay = endOfWeek(monthEnd, { locale: ro });

        // Generăm un array cu toate zilele
        return eachDayOfInterval({ start: startDay, end: endDay });
    };

    // Generăm zilele calendarului pe baza lunii curente
    const calendarDays = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);

    // Funcție pentru sortarea evenimentelor după oră (format HH:mm)
    const sortEventsByTime = (eventA, eventB) => {
        if (!eventA.time || !eventB.time) return 0;
        // Comparăm șirurile de caractere (ex: '14:30' vs '09:00')
        return eventA.time.localeCompare(eventB.time); 
    };

    // Ascultarea evenimentelor din Firestore
    useEffect(() => {
        if (!dbInitialized) {
            console.warn("Firestore nu este inițializat. Omitere ascultare evenimente.");
            setIsFetching(false);
            return;
        }
        if (loading || !user) { 
            // Așteptăm autentificarea
            return; 
        }

        const eventsQuery = query(eventsCollectionRef);

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const fetchedEvents = {};
            snapshot.forEach(doc => {
                const event = doc.data();
                const dateKey = event.date; // Format YYYY-MM-DD
                
                if (!fetchedEvents[dateKey]) {
                    fetchedEvents[dateKey] = [];
                }
                // Adăugăm evenimentul, inclusiv câmpul 'time' și 'createdBy'
                fetchedEvents[dateKey].push({ id: doc.id, ...event });
            });
            
            // Sortăm evenimentele în fiecare zi după oră
            Object.keys(fetchedEvents).forEach(dateKey => {
                fetchedEvents[dateKey].sort(sortEventsByTime);
            });

            setEvents(fetchedEvents);
            setIsFetching(false);
            console.log("Evenimente încărcate în timp real. Zile cu evenimente:", Object.keys(fetchedEvents).length);
        }, (error) => {
            console.error("Eroare la ascultarea evenimentelor Firestore:", error);
            setIsFetching(false);
        });

        return () => unsubscribe();
    }, [loading, user]); // Dependență adăugată pentru 'user'

    // Setează ziua selectată și actualizează luna afișată la luna zilei selectate
    const handleDayClick = (day) => {
        setSelectedDate(day);
        setCurrentMonth(day); 
    };

    // Funcții de navigare lună
    const goToPreviousMonth = () => {
        setCurrentMonth(prev => subMonths(prev, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => addMonths(prev, 1));
    };
    
    // NOU: Funcție generală de verificare a permisiunilor de Modificare/Ștergere
    const isAuthorizedToModify = (event) => {
        if (!user) return false;
        
        // Admin sau Lider poate modifica orice
        if (role === 'admin' || role === 'lider') return true;
        
        // Creatorul evenimentului poate modifica propriul eveniment
        return event?.createdBy === user.uid;
    };


    // Deschide modalul pentru CREARE (Doar Admin/Lider poate crea)
    const isAuthorizedToCreate = user && (role === 'admin' || role === 'lider');

    const handleOpenNewEventModal = () => {
        if (!isAuthorizedToCreate) {
            console.error("Acces neautorizat. Utilizatorul nu are drepturi de adăugare.");
            return;
        }
        
        // NOU: Verifică dacă data selectată este în trecut (compară doar ziua, ignorând ora)
        const todayStart = startOfDay(new Date());
        const selectedDayStart = startOfDay(selectedDate);
        
        if (selectedDayStart < todayStart) {
            // Nu deschidem modalul pentru a crea evenimente în trecut (această logică este menținută pentru siguranță)
            console.warn("Încercare de a adăuga eveniment pentru o dată trecută. Operațiune blocată.");
            return;
        }
        
        setModalState({
            isOpen: true,
            eventToEdit: null,
            selectedDateForNew: selectedDate,
        });
    }

    // Deschide modalul pentru EDITARE (Admin/Lider SAU Creatorul Evenimentului)
    const handleOpenEditEventModal = (event) => {
        if (!isAuthorizedToModify(event)) {
            console.error("Acces neautorizat. Nu aveți permisiunea de a edita acest eveniment.");
            return;
        }
        setModalState({
            isOpen: true,
            eventToEdit: event,
            selectedDateForNew: null,
        });
    }

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            eventToEdit: null,
            selectedDateForNew: null,
        });
    }

    // Funcție pentru Creare/Salvare
    const handleSaveEvent = async (idOrData, dataIfUpdate) => {
        try {
            if (modalState.eventToEdit) {
                // Mod de editare
                await updateEvent(idOrData, dataIfUpdate);
                console.log("Eveniment actualizat cu succes!");
            } else {
                // Mod de creare
                await addEvent(idOrData);
                console.log("Eveniment salvat cu succes!");
            }
        } catch (error) {
            console.error("Eroare la operațiunea de salvare/actualizare:", error);
            // Re-aruncăm eroarea pentru ca modalul să o poată afișa
            throw error; 
        }
    };
    
    // Funcție pentru Ștergere
    const handleDeleteEvent = async (id) => {
        try {
            await deleteEvent(id);
            console.log("Eveniment șters cu succes!");
        } catch (error) {
            console.error("Eroare la operațiunea de ștergere:", error);
            throw error; 
        }
    }

    // Evenimentele pentru ziua selectată
    const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    const eventsForSelectedDay = events[selectedDateKey] || [];

    // Numele abreviate ale zilelor săptămânii în română (folosim `ro` locale)
    const romanianDayNamesFull = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const dayNames = romanianDayNamesFull.map((day, index) => format(new Date(2023, 0, index + 1), 'EEE', { locale: ro }));
    
    return (
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto relative border-4 border-indigo-100">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                Calendar Evenimente
            </h2>
            
            {/* Stare de Încărcare */}
            {isFetching && (
                <div className="py-12 text-center text-indigo-600 font-semibold text-lg">
                    Se încarcă evenimentele în timp real...
                </div>
            )}
            
            {/* Secțiunea Calendar Grid */}
            {!isFetching && (
                <>
                {/* Antetul Calendarului cu Navigare */}
                <div className="flex flex-col items-center px-4 py-3 mb-4 text-xl font-extrabold text-gray-800 border-b-2 border-indigo-200">
                    <div className="flex justify-between items-center w-full max-w-sm">
                        <button 
                            onClick={goToPreviousMonth} 
                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <span className="text-xl sm:text-2xl font-extrabold text-indigo-700 capitalize">
                            {format(currentMonth, 'MMMM yyyy', { locale: ro })}
                        </span>
                        <button 
                            onClick={goToNextMonth} 
                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Numele Zilelor Săptămânii */}
                    <div className="grid grid-cols-7 text-center font-bold text-gray-700 uppercase border-b border-indigo-300">
                        {romanianDayNamesFull.map((day, index) => (
                            <div 
                                key={day} 
                                className="h-10 flex items-center justify-center text-xs sm:text-sm" // Modificare aici
                            >
                                <span className="hidden sm:inline">{day}</span>
                                <span className="sm:hidden">{dayNames[index]}</span> {/* Presupunem că dayNames sunt inițialele */}
                            </div>
                        ))}
                    </div>

                {/* Grila Zilelor - Adaptată pentru mobil */}
                <div className="grid grid-cols-7 auto-rows-[4rem] sm:auto-rows-[6rem] gap-0.5 sm:gap-1 mt-1">
                    {calendarDays.map((day) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayEvents = events[dateKey] || [];
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, today);

                        let cellClasses = 'rounded-lg sm:rounded-xl h-full transition duration-300 border border-gray-100 cursor-pointer group shadow-sm';
                        
                        if (!isCurrentMonth) {
                            cellClasses += ' text-gray-400 bg-gray-50 opacity-70 pointer-events-none shadow-inner';
                        } else {
                            cellClasses += ' bg-white hover:bg-indigo-50 hover:shadow-lg';
                        }
                        
                        if (isToday && !isSelected) {
                            cellClasses = 'bg-indigo-100 text-indigo-800 shadow-xl relative overflow-hidden ring-2 ring-indigo-400/50';
                        }

                        if (isSelected) {
                            cellClasses = 'bg-indigo-600 text-white shadow-2xl relative overflow-hidden transform scale-[1.01] border-indigo-700 z-10';
                        }
                        
                        // Indicator eveniment (bulină roșie)
                        const hasEventsClass = dayEvents.length > 0 ? "relative after:absolute after:bottom-1 after:right-1 after:w-2 after:h-2 after:bg-red-500 after:rounded-full after:shadow-lg sm:after:w-3 sm:after:h-3" : "";

                        return (
                            <div
                                key={dateKey}
                                className={`${cellClasses} ${hasEventsClass} p-1`}
                                onClick={() => handleDayClick(day)}
                            >
                                <div className="flex flex-col items-start justify-start h-full w-full relative">
                                    <span className={`text-md sm:text-lg font-extrabold transition duration-300 ${isSelected ? 'text-white' : (isCurrentMonth ? 'text-gray-900 group-hover:text-indigo-800' : 'text-gray-500')}`}>
                                        {format(day, 'd')}
                                    </span>
                                    
                                    {dayEvents.length > 0 && (
                                        <div className="flex flex-col items-start mt-0.5 sm:mt-1 w-full max-h-8 sm:max-h-12 overflow-hidden px-0.5 sm:px-1 space-y-0.5">
                                            {dayEvents.slice(0, 1).map((event) => (
                                            <span
                                                className="text-xs sm:text-sm font-medium text-white bg-indigo-600 px-1.5 sm:px-2 py-0.5 rounded-full truncate w-full text-left sm:text-center shadow-md border border-indigo-700/50"
                                                title={event.title}
                                                key={event.time}
                                            >
                                                {event.time ? `${event.time} - ${event.title}` : event.title}
                                            </span>
                                            ))}
                                            {dayEvents.length > 1 && (
                                                <span className="text-[10px] sm:text-xs text-gray-600 bg-gray-200 rounded-full px-1.5 py-0.5 font-bold mt-0.5">
                                                    + {dayEvents.length - 1}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* --- Secțiunea de Afișare Evenimente pentru Ziua Selectată (Mobile-Friendly) --- */}
                <div className="mt-8 border-t-4 border-indigo-500/50 pt-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                        Evenimente pe {selectedDate.toLocaleDateString('ro-RO')}
                        {isAuthorizedToCreate && (
                            <button
                                onClick={!isPastDate ? handleOpenNewEventModal : undefined}
                                disabled={isPastDate}
                                className={`
                                    px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium rounded-full transition shadow-lg flex items-center
                                    ${isPastDate 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-70' // Stil pentru disabled
                                        : 'bg-green-500 text-white hover:bg-green-600' // Stil normal
                                    }
                                `}
                                title={isPastDate ? "Nu se pot adăuga evenimente în trecut" : "Adaugă un eveniment nou"}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Adaugă
                            </button>
                        )}
                    </h3>
                    
                    {eventsForSelectedDay.length > 0 ? (
                        <ul className="space-y-3">
                            {eventsForSelectedDay.map((event) => (
                                <li 
                                    key={event.id}
                                    className="p-3 sm:p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex justify-between items-start"
                                >
                                    <div>
                                        <p className="text-base sm:text-lg font-semibold text-indigo-800">
                                            {event.time && <span className="font-extrabold mr-2 text-indigo-700 bg-indigo-200 px-2 py-0.5 rounded-md text-sm">{event.time}</span>}
                                            {event.title}
                                        </p>
                                        {event.description && <p className="text-gray-600 mt-1 text-sm">{event.description}</p>}
                                    </div>
                                    {/* Afișăm butonul de editare doar dacă este autorizat */}
                                    {isAuthorizedToModify(event) && (
                                        <button
                                            onClick={() => handleOpenEditEventModal(event)}
                                            className="ml-4 p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-200/50 rounded-full hover:bg-indigo-200 transition"
                                            title="Modifică evenimentul"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 bg-gray-100 text-gray-600 rounded-xl text-center border border-dashed border-gray-300">
                            Nu există evenimente planificate pentru această dată.
                        </div>
                    )}

                    {!user && (
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Vă rugăm să vă autentificați (Login Test) pentru a putea vizualiza/crea/edita evenimente.
                        </p>
                    )}
                    {user && !isAuthorizedToCreate && (
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Sunteți autentificat! Doar utilizatorii cu rolul de Admin sau Lider pot adăuga evenimente noi. Puteți edita doar evenimentele pe care le-ați creat.
                        </p>
                    )}
                </div>
                </>
            )}
            
            {/* Modalul de Creare/Editare Eveniment */}
            {modalState.isOpen && (
                <EventFormModal 
                    selectedDate={modalState.selectedDateForNew}
                    eventToEdit={modalState.eventToEdit}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    currentUserId={user?.uid} // Transmitem ID-ul utilizatorului curent
                />
            )}
        </div>
    );
}