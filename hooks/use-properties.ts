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
    Query,
    DocumentData,
    CollectionReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/auth-context';
import { uploadToCloudinary } from '@/lib/cloudinary/config';

export interface PropertyData {
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    distance: number;
    location: string;
    description: string;
    propertyType: string;
    availableFrom: string;
    leaseTerm: string;
    deposit: number;
    amenities: {
        [key: string]: boolean;
    };
    imageUrls?: string[];
}

export interface Property extends PropertyData {
    id: string;
}

export interface PropertyFilters {
    searchQuery?: string;
    priceRange?: {
        min?: number;
        max?: number;
    };
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    distance?: number;
    amenities?: string[];
    propertyIds?: string[];
}

export const useProperties = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const addProperty = async (propertyData: PropertyData, images: File[]) => {
        setLoading(true);
        setError(null);

        try {
            // Upload images to Cloudinary
            const imageUrls = await Promise.all(
                (images || []).filter(img => img instanceof File).map(image => uploadToCloudinary(image))
            );

            // Add property to Firestore with image URLs
            const propertyWithImages = {
                ...propertyData,
                imageUrls: imageUrls.filter(url => typeof url === 'string'),
                landlordId: user?.uid,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'properties'), propertyWithImages);
            setLoading(false);
            return docRef.id;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const getLandlordProperties = async () => {
        if (!user) throw new Error('No authenticated user');

        setLoading(true);
        try {
            const q = query(
                collection(db, 'properties'),
                where('landlordId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);
            const properties = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Property[];
            setLoading(false);
            return properties;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const updateProperty = async (propertyId: string, propertyData: Partial<PropertyData>, newImages?: File[]) => {
        setLoading(true);
        try {
            let updateData = { ...propertyData };

            if (newImages && newImages.length > 0) {
                const newImageUrls = await Promise.all(
                    (newImages || []).filter(img => img instanceof File).map(image => uploadToCloudinary(image))
                );
                updateData.imageUrls = [...(propertyData.imageUrls || []), ...newImageUrls.filter(url => typeof url === 'string')];
            }

            await updateDoc(doc(db, 'properties', propertyId), updateData);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const deleteProperty = async (propertyId: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, 'properties', propertyId));
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const searchProperties = async (filters: PropertyFilters = {}): Promise<Property[]> => {
        setLoading(true);
        setError(null);

        try {
            let propertiesQuery: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, 'properties');

            // Apply filters
            if (filters.priceRange?.min) {
                propertiesQuery = query(propertiesQuery, where('price', '>=', filters.priceRange.min));
            }
            if (filters.priceRange?.max) {
                propertiesQuery = query(propertiesQuery, where('price', '<=', filters.priceRange.max));
            }
            if (filters.bedrooms) {
                propertiesQuery = query(propertiesQuery, where('bedrooms', '==', filters.bedrooms));
            }
            if (filters.bathrooms) {
                propertiesQuery = query(propertiesQuery, where('bathrooms', '==', filters.bathrooms));
            }
            if (filters.propertyType) {
                propertiesQuery = query(propertiesQuery, where('propertyType', '==', filters.propertyType));
            }
            if (filters.distance) {
                propertiesQuery = query(propertiesQuery, where('distance', '<=', filters.distance));
            }

            const querySnapshot = await getDocs(propertiesQuery);
            let properties = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Property[];

            // Filter by property IDs if specified
            if (filters.propertyIds && filters.propertyIds.length > 0) {
                properties = properties.filter(property =>
                    filters.propertyIds!.includes(property.id)
                );
            }

            // Apply text search if query exists
            if (filters.searchQuery) {
                const searchLower = filters.searchQuery.toLowerCase();
                properties = properties.filter(property =>
                    property.title.toLowerCase().includes(searchLower) ||
                    property.location.toLowerCase().includes(searchLower) ||
                    property.description.toLowerCase().includes(searchLower)
                );
            }

            // Filter by amenities if specified
            if (filters.amenities && filters.amenities.length > 0) {
                properties = properties.filter(property =>
                    filters.amenities!.every(amenity =>
                        property.amenities[amenity]
                    )
                );
            }

            setLoading(false);
            return properties;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        addProperty,
        getLandlordProperties,
        updateProperty,
        deleteProperty,
        searchProperties,
        loading,
        error
    };
}; 