'use client';

import { useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';

export interface UserProfile {
    id: string;
    email: string;
    role: 'landlord' | 'student';
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        searchRadius: number;
        priceRange: {
            min: number;
            max: number;
        };
        propertyTypes: string[];
        amenities: string[];
    };
    favorites: string[];
    createdAt: string;
    updatedAt: string;
}

export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const getProfile = async (): Promise<UserProfile | null> => {
        if (!user) return null;

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLoading(false);
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as UserProfile;
            } else {
                setLoading(false);
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const updateProfile = async (profileData: Partial<UserProfile>) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, 'users', user.uid);
            const updateData = {
                ...profileData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updateData);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, 'users', user.uid);
            const updateData = {
                preferences: {
                    ...preferences
                },
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updateData);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const toggleFavorite = async (propertyId: string) => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            const userData = docSnap.data() as UserProfile;
            const favorites = userData.favorites || [];

            const newFavorites = favorites.includes(propertyId)
                ? favorites.filter(id => id !== propertyId)
                : [...favorites, propertyId];

            await updateDoc(docRef, {
                favorites: newFavorites,
                updatedAt: new Date().toISOString()
            });

            setLoading(false);
            return newFavorites;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        getProfile,
        updateProfile,
        updatePreferences,
        toggleFavorite,
        loading,
        error
    };
}; 