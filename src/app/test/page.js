// src/app/test/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    setPersistence, 
    browserLocalPersistence,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth'; 
import { auth } from '@/lib/firebase'; 

export default function DebugLoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    
    // Asigură că utilizatorii logați sunt trimiși acasă
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    // FUNCTIA PENTRU LOGIN-UL CU EMAIL/PAROLĂ (TEST)
    const handleTestLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError('Autentificare eșuată. Verificați email-ul/parola.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200"> {/* Fundal mai închis */}
            <div className="p-8 bg-white shadow-xl rounded-lg max-w-sm w-full text-center border-t-4 border-red-600">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Debug Login (Admin/Lider)</h2>

                <p className="text-gray-700 mb-6"> {/* Text mai vizibil */}
                    Rută de testare. Folosiți conturile permanente.
                </p>

                <form onSubmit={handleTestLogin} className="space-y-4">
                    <input 
                        type="email"
                        placeholder="Email (ex: lider.test@connect.ro)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        // Stilizare input-uri îmbunătățită
                        className="w-full p-3 border border-gray-400 rounded-md shadow-sm focus:ring-red-600 focus:border-red-600 text-gray-900 bg-white" 
                    />
                    <input 
                        type="password"
                        placeholder="Parolă"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        // Stilizare input-uri îmbunătățită
                        className="w-full p-3 border border-gray-400 rounded-md shadow-sm focus:ring-red-600 focus:border-red-600 text-gray-900 bg-white"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-150 disabled:opacity-50"
                    >
                        {loading ? 'Se conectează...' : 'Login Test'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}