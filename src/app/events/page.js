// src/app/events/page.js

import React from 'react';
import Calendar from '@/components/Calendar'; 

// Am decis să nu închid pagina în ProtectedRoute, dar componentul Calendar va cere autentificare pentru adăugare.

// Acesta este componentul care va fi redat pe ruta /events
function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-2 text-center tracking-tight">Calendarul Evenimentelor Comunității</h1>
        <p className="text-xl text-gray-600 mb-10 text-center font-light">
          Vizualizați și planificați întâlnirile viitoare ale echipei. Clic pe o zi pentru a adăuga un eveniment!
        </p>
        
        {/* Componentul Calendar (care include logica Firebase) */}
        <Calendar />
        
      </div>
    </div>
  );
}

export default EventsPage;