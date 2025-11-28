// src/app/login/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    signInAnonymously, 
    setPersistence, 
    browserLocalPersistence,
    onAuthStateChanged
} from 'firebase/auth'; 
import { auth } from '@/lib/firebase'; 

export default function LoginPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    
    const handleAnonLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInAnonymously(auth);
            // Redirecționarea va fi gestionată de onAuthStateChanged în layout
            // Dar pentru siguranță, putem forța.
            router.push('/');
        } catch (e) {
            setError("Autentificarea anonimă a eșuat. Vă rugăm reîncercați.");
            setLoading(false);
        }
    };

    useEffect(() => {
        // Verificăm dacă utilizatorul este deja logat (persistență)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">
                Se verifică sesiunea...
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full text-center">
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">Bine ați venit!</h2>

                <p className="text-gray-600 mb-8">
                    Vă rugăm să apăsați butonul de mai jos pentru a accesa Connect.
                </p>

                <button
                    onClick={handleAnonLogin}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-150 disabled:opacity-50"
                >
                    {loading ? 'Se conectează...' : 'Intră în Aplicație'}
                </button>
                
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                
                <p className="mt-4 text-gray-500 text-sm">
                    Nu este necesară parolă. Vei fi logat automat.
                </p>
            </div>
        </div>
    );
}