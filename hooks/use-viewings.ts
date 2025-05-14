'use client';

import { useState } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';

export interface ViewingData {
    id?: string;
    propertyId: string;
    propertyTitle: string;
    userId: string;
    userEmail: string;
    userName: string;
    date: string;
    time: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export function useViewings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scheduleViewing = async (data: Omit<ViewingData, 'id' | 'userId' | 'userEmail' | 'userName' | 'status' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error("You must be logged in to schedule a viewing");

        setLoading(true);
        setError(null);

        try {
            const viewingData: Omit<ViewingData, 'id'> = {
                ...data,
                userId: user.uid,
                userEmail: user.email!,
                userName: user.displayName || user.email!,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await addDoc(collection(db, 'viewings'), viewingData);
            return { id: docRef.id, ...viewingData };
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserViewings = async () => {
        if (!user) throw new Error("You must be logged in to view your bookings");

        setLoading(true);
        setError(null);

        try {
            const q = query(
                collection(db, 'viewings'),
                where('userId', '==', user.uid),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ViewingData[];
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getLandlordViewings = async (propertyIds: string[]) => {
        if (!user) throw new Error("You must be logged in to view property bookings");

        setLoading(true);
        setError(null);

        try {
            const q = query(
                collection(db, 'viewings'),
                where('propertyId', 'in', propertyIds),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ViewingData[];
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateViewingStatus = async (viewingId: string, status: 'confirmed' | 'cancelled') => {
        if (!user) throw new Error("You must be logged in to update viewing status");

        setLoading(true);
        setError(null);

        try {
            const viewingRef = doc(db, 'viewings', viewingId);
            await updateDoc(viewingRef, {
                status,
                updatedAt: new Date()
            });
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const cancelViewing = async (viewingId: string) => {
        return updateViewingStatus(viewingId, 'cancelled');
    };

    return {
        scheduleViewing,
        getUserViewings,
        getLandlordViewings,
        updateViewingStatus,
        cancelViewing,
        loading,
        error
    };
} 