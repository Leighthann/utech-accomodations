import { useState } from "react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"

export interface LandlordProperty {
    id?: string
    title: string
    description: string
    price: number
    location: string
    propertyType: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    amenities: string[]
    availableFrom: Date
    furnished: boolean
    petsAllowed: boolean
    status: 'active' | 'inactive' | 'rented'
    createdAt: Date
    updatedAt: Date
}

export function useLandlord() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getLandlordProperties = async () => {
        if (!user) throw new Error("You must be logged in to view your properties")

        setLoading(true)
        setError(null)

        try {
            const q = query(
                collection(db, "properties"),
                where("landlordId", "==", user.uid),
                orderBy("createdAt", "desc")
            )

            const querySnapshot = await getDocs(q)
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LandlordProperty[]
        } catch (err) {
            const error = err as Error
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const addProperty = async (propertyData: Omit<LandlordProperty, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error("You must be logged in to add a property")

        setLoading(true)
        setError(null)

        try {
            const propertyWithMetadata = {
                ...propertyData,
                landlordId: user.uid,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const docRef = await addDoc(collection(db, "properties"), propertyWithMetadata)
            return { id: docRef.id, ...propertyWithMetadata }
        } catch (err) {
            const error = err as Error
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateProperty = async (propertyId: string, updates: Partial<LandlordProperty>) => {
        if (!user) throw new Error("You must be logged in to update a property")

        setLoading(true)
        setError(null)

        try {
            const propertyRef = doc(db, "properties", propertyId)
            await updateDoc(propertyRef, {
                ...updates,
                updatedAt: new Date()
            })
        } catch (err) {
            const error = err as Error
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const deleteProperty = async (propertyId: string) => {
        if (!user) throw new Error("You must be logged in to delete a property")

        setLoading(true)
        setError(null)

        try {
            await deleteDoc(doc(db, "properties", propertyId))
        } catch (err) {
            const error = err as Error
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updatePropertyStatus = async (propertyId: string, status: LandlordProperty['status']) => {
        return updateProperty(propertyId, { status })
    }

    return {
        getLandlordProperties,
        addProperty,
        updateProperty,
        deleteProperty,
        updatePropertyStatus,
        loading,
        error
    }
} 