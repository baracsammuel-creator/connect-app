"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { loginWithName } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Te rugăm să introduci un nume.');
            return;
        }

        setIsLoggingIn(true);
        setError('');

        try {
            await loginWithName(name);
            // Nu este nevoie să facem nimic aici, AuthContext va gestiona actualizarea stării
        } catch (err) {
            setError(err.message || 'A apărut o eroare la autentificare.');
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border-t-4 border-theme-primary">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Bun venit la Connect!</h1>
                    <p className="mt-2 text-gray-600">Introdu numele tău pentru a continua</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-gray-600 block">
                            Numele tău
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                            placeholder="Ex: Alex Popescu"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div>
                        <button type="submit" disabled={isLoggingIn} className="w-full px-4 py-3 font-bold text-white bg-theme-primary rounded-md hover:bg-theme-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50 transition">
                            {isLoggingIn ? 'Se autentifică...' : 'Intră în aplicație'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}