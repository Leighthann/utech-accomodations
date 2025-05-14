"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Property } from "@/types/property"

interface ComparisonContextType {
    comparisonProperties: Property[]
    addToComparison: (property: Property) => void
    removeFromComparison: (propertyId: string) => void
    isInComparison: (propertyId: string) => boolean
    clearComparison: () => void
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
    const [comparisonProperties, setComparisonProperties] = useState<Property[]>([])

    // Load comparison properties from localStorage on mount
    useEffect(() => {
        const savedComparison = localStorage.getItem("comparisonProperties")
        if (savedComparison) {
            try {
                setComparisonProperties(JSON.parse(savedComparison))
            } catch (error) {
                console.error("Error loading comparison properties:", error)
                localStorage.removeItem("comparisonProperties")
            }
        }
    }, [])

    // Save comparison properties to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("comparisonProperties", JSON.stringify(comparisonProperties))
    }, [comparisonProperties])

    const addToComparison = (property: Property) => {
        setComparisonProperties((prev) => {
            // Check if property is already in comparison
            if (prev.some((p) => p.id === property.id)) {
                return prev
            }

            // Check if we've reached the maximum limit (3 properties)
            if (prev.length >= 3) {
                return prev
            }

            return [...prev, property]
        })
    }

    const removeFromComparison = (propertyId: string) => {
        setComparisonProperties((prev) =>
            prev.filter((property) => property.id !== propertyId)
        )
    }

    const isInComparison = (propertyId: string) => {
        return comparisonProperties.some((property) => property.id === propertyId)
    }

    const clearComparison = () => {
        setComparisonProperties([])
    }

    return (
        <ComparisonContext.Provider
            value={{
                comparisonProperties,
                addToComparison,
                removeFromComparison,
                isInComparison,
                clearComparison
            }}
        >
            {children}
        </ComparisonContext.Provider>
    )
}

export function useComparison() {
    const context = useContext(ComparisonContext)
    if (context === undefined) {
        throw new Error("useComparison must be used within a ComparisonProvider")
    }
    return context
} 