"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, role, loading } = useAuth();

    const navItems = [
        { name: "Acasă", href: "/", isVisible: true },
        { name: "Despre", href: "/about", isVisible: true },
        // Noul link pentru Evenimente, vizibil pentru toți utilizatorii
        { name: "Evenimente", href: "/events", isVisible: true }, 
        // Link-ul Profilului, vizibil doar dacă utilizatorul este logat
        { name: "Profil", href: "/profile", isVisible: user && !loading }, 
        // Link-ul Dashboard-ului, vizibil pentru Lideri și Admini
        { name: "Dashboard", href: "/dashboard", isVisible: user && (role === 'admin' || role === 'lider') && !loading }, 
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                
                {/* Logo / Numele Aplicației */}
                <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
                    Connect App
                </Link>

                {/* Navigația Principală */}
                <nav className="flex items-center space-x-4">
                    {navItems.map((item) => (
                        item.isVisible && (
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}

                    {/* Buton Autentificare (rămâne) */}
                    {!loading && (
                        user ? (
                            // AM ELIMINAT BUTONUL DE LOGOUT
                            <div className="text-sm font-medium text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                                Logat ca: {role.toUpperCase()}
                            </div>
                        ) : (
                            <Link 
                                href="/test" 
                                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium transition duration-150 transform hover:scale-105 shadow-md"
                            >
                                Login Test
                            </Link>
                        )
                    )}
                </nav>
            </div>
        </header>
    );
}