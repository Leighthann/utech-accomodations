'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: 'landlord' | 'student') => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    sendVerificationEmail: () => Promise<void>;
    getUserData: () => Promise<any>;
    updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                throw new Error('Please verify your email before signing in.');
            }

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (!userDoc.exists()) {
                throw new Error('User profile not found.');
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/invalid-credential')) {
                    throw new Error('Invalid email or password.');
                }
                if (error.message.includes('auth/too-many-requests')) {
                    throw new Error('Too many failed login attempts. Please try again later.');
                }
            }
            throw error;
        }
    };

    const signUp = async (email: string, password: string, role: 'landlord' | 'student') => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Send verification email
            await sendEmailVerification(user);

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                phoneNumber: user.phoneNumber || '',
                emailVerified: user.emailVerified,
                properties: [],
                favorites: [],
                notifications: [],
                settings: {
                    emailNotifications: true,
                    pushNotifications: true,
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/email-already-in-use')) {
                    throw new Error('An account with this email already exists.');
                }
                if (error.message.includes('auth/weak-password')) {
                    throw new Error('Password should be at least 6 characters.');
                }
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to sign out. Please try again.');
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/user-not-found')) {
                    throw new Error('No account found with this email address.');
                }
            }
            throw new Error('Failed to send password reset email. Please try again.');
        }
    };

    const sendVerificationEmail = async () => {
        if (!user) throw new Error('No authenticated user');

        try {
            await sendEmailVerification(user);
        } catch (error) {
            throw new Error('Failed to send verification email. Please try again.');
        }
    };

    const getUserData = async () => {
        if (!user) return null;

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                throw new Error('User profile not found.');
            }
            return userDoc.data();
        } catch (error) {
            console.error('Error getting user data:', error);
            throw new Error('Failed to get user data. Please try again.');
        }
    };

    const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
        if (!user) throw new Error('No authenticated user');

        try {
            // Update in Firebase Auth
            await updateDoc(doc(db, 'users', user.uid), {
                ...data,
                updatedAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update profile. Please try again.');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                logout,
                resetPassword,
                sendVerificationEmail,
                getUserData,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 