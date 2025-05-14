'use client';

import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';

export interface SavedSearch {
    id: string;
    userId: string;
    name: string;
    filters: {
        propertyType?: string[];
        priceRange?: {
            min: number;
            max: number;
        };
        bedrooms?: number[];
        bathrooms?: number[];
        amenities?: string[];
        location?: string;
        distance?: number;
    };
    emailNotifications: boolean;
    notificationFrequency: 'daily' | 'weekly' | 'instant';
    lastNotified?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export function useSavedSearches() {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'savedSearches'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const searches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedSearch[];
            setSavedSearches(searches);
        });

        return () => unsubscribe();
    }, [user]);

    const saveSearch = async (searchData: Omit<SavedSearch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const searchRef = await addDoc(collection(db, 'savedSearches'), {
                ...searchData,
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return searchRef.id;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateSearch = async (searchId: string, updates: Partial<SavedSearch>) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const searchRef = doc(db, 'savedSearches', searchId);
            await updateDoc(searchRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteSearch = async (searchId: string) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            await deleteDoc(doc(db, 'savedSearches', searchId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleEmailNotifications = async (searchId: string, enabled: boolean) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const searchRef = doc(db, 'savedSearches', searchId);
            await updateDoc(searchRef, {
                emailNotifications: enabled,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateNotificationFrequency = async (searchId: string, frequency: 'daily' | 'weekly' | 'instant') => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const searchRef = doc(db, 'savedSearches', searchId);
            await updateDoc(searchRef, {
                notificationFrequency: frequency,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        savedSearches,
        loading,
        error,
        saveSearch,
        updateSearch,
        deleteSearch,
        toggleEmailNotifications,
        updateNotificationFrequency
    };
} 