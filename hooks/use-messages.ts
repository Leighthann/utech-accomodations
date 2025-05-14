'use client';

import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs,
    Timestamp,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    propertyId: string;
    content: string;
    timestamp: Timestamp;
    read: boolean;
}

export const useMessages = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const sendMessage = async (
        receiverId: string,
        propertyId: string,
        content: string
    ): Promise<void> => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            await addDoc(collection(db, 'messages'), {
                senderId: user.uid,
                receiverId,
                propertyId,
                content,
                timestamp: serverTimestamp(),
                read: false
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getConversations = (callback: (conversations: any[]) => void) => {
        if (!user) return () => { };

        const q = query(
            collection(db, 'messages'),
            where('participants', 'array-contains', user.uid),
            orderBy('timestamp', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(conversations);
        });
    };

    const getMessages = (
        propertyId: string,
        otherUserId: string,
        callback: (messages: Message[]) => void
    ) => {
        if (!user) return () => { };

        const q = query(
            collection(db, 'messages'),
            where('propertyId', '==', propertyId),
            where('participants', 'array-contains', user.uid),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            callback(messages);
        });
    };

    const markAsRead = async (messageId: string): Promise<void> => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        setError(null);

        try {
            const messageRef = doc(db, 'messages', messageId);
            await updateDoc(messageRef, {
                read: true
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
        sendMessage,
        getConversations,
        getMessages,
        markAsRead,
        loading,
        error
    };
}; 