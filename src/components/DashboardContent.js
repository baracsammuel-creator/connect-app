// src/components/DashboardContent.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth'; // Pentru a obține token-ul Adminului

export default function DashboardContent() {
    const { role, loading } = useAuth();
    const router = useRouter();
    
    // Stări pentru formularul de Admin
    const [targetUid, setTargetUid] = useState('');
    const [newRole, setNewRole] = useState('adolescent');
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && role !== 'admin' && role !== 'lider') {
            router.push('/');
        }
    }, [role, loading, router]);

    // Funcția care apelează API-ul securizat
    const handleSetRole = async (e) => {
        e.preventDefault();
        
        if (!targetUid) {
            setStatusMessage({ message: 'UID-ul nu poate fi gol.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage({ message: 'Se actualizează rolul...', type: 'info' });

        try {
            // Obținem token-ul curent al Adminului pentru a-l trimite în API (securitate)
            const idToken = await getAuth().currentUser.getIdToken();
            
            // MODIFICARE AICI: Folosim ruta existentă: /api/set-leader
            const response = await fetch('/api/set-leader', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUid, newRole, idToken }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ message: data.message, type: 'success' });
            } else {
                setStatusMessage({ message: data.message || 'Eroare necunoscută la API.', type: 'error' });
            }
        } catch (error) {
            setStatusMessage({ message: `Eroare de rețea: ${error.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || (role !== 'admin' && role !== 'lider')) {
        return <div className="mt-8 text-center text-indigo-600">{loading ? 'Se încarcă...' : 'Redirecționare...'}</div>;
    }

    // --- CONȚINUTUL PAGINII PENTRU ADMIN ȘI LIDER ---
    return (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border-t-4 border-indigo-500">
            
            {/* Secțiune vizibilă doar pentru ADMIN */}
            {role === 'admin' && (
                <div className="space-y-6 p-4 border rounded-lg bg-red-50">
                    <h3 className="text-2xl font-bold text-red-600">Admin: Gestionare Roluri</h3>
                    <p className="text-gray-700">
                        Introduceți UID-ul utilizatorului (ex: din consola Firebase) și selectați rolul dorit.
                    </p>

                    <form onSubmit={handleSetRole} className="space-y-4">
                        {/* Câmp UID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">UID Utilizator</label>
                            <input
                                type="text"
                                value={targetUid}
                                onChange={(e) => setTargetUid(e.target.value)}
                                placeholder="UID-ul de 28 de caractere"
                                required
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        {/* Selector Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rol Nou</label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white"
                            >
                                <option value="adolescent">adolescent</option>
                                <option value="lider">lider</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>

                        {/* Buton Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Se procesează...' : `Setează Rolul la "${newRole}"`}
                        </button>
                    </form>

                    {/* Mesaj de Status */}
                    {statusMessage.message && (
                        <div className={`p-3 rounded-md text-sm ${
                            statusMessage.type === 'error' ? 'bg-red-200 text-red-800' : 
                            statusMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                        }`}>
                            {statusMessage.message}
                        </div>
                    )}
                </div>
            )}

            {/* Secțiune vizibilă pentru LIDER */}
            {role === 'lider' && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-600">Lider Connect Access</h3>
                    <p className="text-gray-700">
                        Instrumente pentru gestionarea grupului.
                    </p>
                </div>
            )}
        </div>
    );
}