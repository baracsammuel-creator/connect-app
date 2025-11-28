// src/components/ProtectedRoute.js (sau unde aveți logica de redirecționare)

"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

// Rute care NU necesită autentificare
const UNPROTECTED_PATHS = ['/login', '/test', '/about', '/contact', '/']; // <-- ADAUGĂ /test AICI

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isUnprotected = UNPROTECTED_PATHS.includes(pathname);
    // Logica suplimentară pentru /dashboard este în DashboardContent.js

    useEffect(() => {
        // Așteptăm să se termine încărcarea stării Firebase
        if (loading) return; 

        // Dacă nu există utilizator ȘI ruta NU este neprotejată, redirecționează la login
        if (!user && !isUnprotected) {
            router.push('/login');
        }

    }, [user, loading, pathname, isUnprotected, router]);

    // Afișăm conținutul doar dacă starea este cunoscută și suntem pe o rută OK
    if (loading || (!user && !isUnprotected)) {
        return <div className="text-center p-10">Se verifică autentificarea...</div>;
    }
    
    return children;
}