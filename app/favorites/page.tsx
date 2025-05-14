"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useProperties } from "@/hooks/use-properties"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
    const { user } = useAuth()
    const { getFavorites } = useFavorites()
    const { getPropertiesByIds, loading: propertiesLoading } = useProperties()
    const [favoriteProperties, setFavoriteProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadFavorites = async () => {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const favoriteIds = await getFavorites()
                if (favoriteIds.length > 0) {
                    const properties = await getPropertiesByIds(favoriteIds)
                    setFavoriteProperties(properties)
                }
            } catch (error) {
                console.error("Error loading favorites:", error)
            } finally {
                setLoading(false)
            }
        }

        loadFavorites()
    }, [user, getFavorites, getPropertiesByIds])

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Sign in to View Favorites</h1>
                    <p className="text-gray-600 mb-6">
                        Please sign in to view and manage your favorite properties.
                    </p>
                    <Link href="/auth/login">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (loading || propertiesLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Favorite Properties</h1>

            {favoriteProperties.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">No Favorite Properties Yet</h2>
                    <p className="text-gray-600 mb-6">
                        Start exploring properties and add them to your favorites to see them here.
                    </p>
                    <Link href="/properties">
                        <Button>Browse Properties</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    )
} 