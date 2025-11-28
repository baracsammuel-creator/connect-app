// src/context/AuthContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; // Eliminăm signOut
import { auth } from '@/lib/firebase'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('adolescent'); 
    const [loading, setLoading] = useState(true);

    // FUNCTIA 'LOGOUT' ESTE ELIMINATĂ DE AICI
    // const logout = () => { signOut(auth); };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                const token = await currentUser.getIdTokenResult(true); 
                const claims = token.claims;
                
                if (claims.admin) {
                    setRole('admin');
                } else if (claims.lider) {
                    setRole('lider');
                } else {
                    setRole('adolescent'); 
                }
            } else {
                setRole('adolescent');
            }
            
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        // ATENȚIE: 'logout' ESTE ELIMINAT din value
        <AuthContext.Provider value={{ user, loading, role }}> 
            {children}
        </AuthContext.Provider>
    );
};