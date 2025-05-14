import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface Property {
    id: string
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
}

const MAX_COMPARISON_PROPERTIES = 3

export function usePropertyComparison() {
    const [comparisonProperties, setComparisonProperties] = useLocalStorage<Property[]>(
        'property-comparison',
        []
    )

    const addProperty = (property: Property) => {
        setComparisonProperties((prev) => {
            // Check if property is already in comparison
            if (prev.some((p) => p.id === property.id)) {
                return prev
            }

            // Check if we've reached the maximum number of properties
            if (prev.length >= MAX_COMPARISON_PROPERTIES) {
                return prev
            }

            return [...prev, property]
        })
    }

    const removeProperty = (propertyId: string) => {
        setComparisonProperties((prev) =>
            prev.filter((property) => property.id !== propertyId)
        )
    }

    const clearComparison = () => {
        setComparisonProperties([])
    }

    return {
        comparisonProperties,
        addProperty,
        removeProperty,
        clearComparison,
        maxProperties: MAX_COMPARISON_PROPERTIES
    }
} 