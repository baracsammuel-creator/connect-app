// src/app/dashboard/page.js

import DashboardContent from '../../components/DashboardContent'; // Cale relativă (sau folosiți alias-ul @/components)

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Panou de Administrare</h1>
            <p className="mt-2 text-xl text-gray-500">
                Bun venit în zona protejată!
            </p>
            
            {/* Componenta client care gestionează afișarea bazată pe rol */}
            <DashboardContent /> 
        </div>
    );
}