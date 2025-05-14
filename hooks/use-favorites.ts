'use client';

import { useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';

export const useFavorites = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const toggleFavorite = async (propertyId: string) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                throw new Error('User profile not found');
            }

            const userData = userDoc.data();
            const favorites = userData.favorites || [];

            if (favorites.includes(propertyId)) {
                await updateDoc(userRef, {
                    favorites: arrayRemove(propertyId)
                });
            } else {
                await updateDoc(userRef, {
                    favorites: arrayUnion(propertyId)
                });
            }

            setLoading(false);
            return !favorites.includes(propertyId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const getFavorites = async (): Promise<string[]> => {
        if (!user) return [];

        setLoading(true);
        setError(null);

        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                throw new Error('User profile not found');
            }

            const userData = userDoc.data();
            setLoading(false);
            return userData.favorites || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const isFavorite = async (propertyId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const favorites = await getFavorites();
            return favorites.includes(propertyId);
        } catch (err) {
            console.error('Error checking favorite status:', err);
            return false;
        }
    };

    return {
        toggleFavorite,
        getFavorites,
        isFavorite,
        loading,
        error
    };
}; 