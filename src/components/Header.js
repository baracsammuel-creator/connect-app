// src/components/Header.js
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { usePathname } from 'next/navigation'; // <-- Import NOU

export default function Header() {
    const { user, role } = useAuth(); 
    const isLeaderOrAdmin = role === 'admin' || role === 'lider';
    const pathname = usePathname(); // <-- Instanțierea NOUĂ

    // Logica de stilizare a link-urilor
    const getLinkClass = (path) => {
        // Dacă pathname-ul curent este EXACT egal cu path-ul link-ului
        const isActive = pathname === path; 
        
        return `font-medium transition duration-150 ${
            isActive 
            ? 'text-indigo-800 border-b-2 border-indigo-600 font-bold' // Stilizare Activă
            : 'text-gray-600 hover:text-indigo-600' // Stilizare Inactivă
        }`;
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* Logo/Site Title */}
                <Link href="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-800 transition duration-150">
                    CONNECT
                </Link>
                
                {/* Navigation Links și Starea Utilizatorului */}
                <div className="flex items-center space-x-8">
                    
                    <Link href="/" className={getLinkClass('/')}>
                        Home
                    </Link>
                    <Link href="/about" className={getLinkClass('/about')}>
                        About
                    </Link>
                    
                    {isLeaderOrAdmin && (
                        <Link 
                            href="/dashboard" 
                            className={`transition duration-150 ${
                                pathname === '/dashboard' // <-- Verificare EXACTĂ
                                ? 'text-green-800 border-b-2 border-green-600 font-bold'
                                : 'text-green-600 hover:text-green-800 font-medium'
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}
                    
                    <Link href="/contact" className={getLinkClass('/contact')}>
                        Contact
                    </Link>

                    {/* Afișăm Rolul */}
                    {user && (
                        <span className={`text-sm font-semibold uppercase px-3 py-1 rounded-full 
                            ${role === 'admin' ? 'bg-red-500 text-white' : role === 'lider' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {role}
                        </span>
                    )}
                </div>
            </nav>
        </header>
    );
}