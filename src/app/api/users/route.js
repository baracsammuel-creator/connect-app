import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin'; // Importă Admin SDK-ul inițializat

const adminAuth = admin.auth(); 

/**
 * Gestionează cererea GET pentru listarea utilizatorilor.
 * Rută securizată: necesită un token de Admin valid.
 */
export async function GET(req) {
    try {
        // 1. Extrage token-ul din header-ul Authorization
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Header-ul de autorizare lipsește sau este invalid.' }, { status: 401 });
        }

        const idToken = authorizationHeader.split('Bearer ')[1];

        if (!idToken) {
            return NextResponse.json({ message: 'Token-ul de autentificare lipsește.' }, { status: 401 });
        }

        // 2. VERIFICARE SECURITATE: Decodăm token-ul pentru a verifica rolul
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        
        // Asigurăm-ne că doar utilizatorii cu rolul 'admin' pot executa această funcție
        if (!decodedToken.admin) {
            return NextResponse.json({ message: 'Acces neautorizat. Doar Adminii pot vizualiza lista de utilizatori.' }, { status: 403 });
        }
        
        // 3. Extrage toți utilizatorii din Firebase Auth (maximum 1000 la un singur apel)
        const listUsersResult = await adminAuth.listUsers();
        
        // 4. Maparea datelor pentru a returna doar informațiile relevante
        const users = listUsersResult.users.map(user => {
            // Extrage rolul din custom claims (default 'adolescent' dacă lipsește)
            const role = user.customClaims?.role || (user.isAnonymous ? 'adolescent' : 'necunoscut');

            return {
                uid: user.uid,
                nume: user.displayName || 'Anonim',
                isAnonymous: user.isAnonymous,
                creationTime: user.metadata.creationTime,
                role: role,
            };
        });

        return NextResponse.json({ 
            users: users,
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error('Eroare la listarea utilizatorilor (API):', error.message);
        // Nu expune mesajul de eroare intern în producție
        const errorMessage = process.env.NODE_ENV === 'production' 
            ? 'A apărut o eroare internă pe server.' 
            : `Eroare internă: ${error.message}`;
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}