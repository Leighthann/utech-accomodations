"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Bed, Bath, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/components/ui/use-toast"
import CompareButton from "@/components/compare-button"
import { Property } from "@/types/property"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth()
  const { toggleFavorite, isFavorite, loading: favoriteLoading } = useFavorites()
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const favorited = await isFavorite(property.id)
          setIsFavorited(favorited)
        } catch (error) {
          console.error("Error checking favorite status:", error)
        }
      }
      setIsCheckingFavorite(false)
    }

    checkFavoriteStatus()
  }, [user, property.id, isFavorite])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add properties to your favorites.",
        variant: "destructive"
      })
      return
    }

    setIsCheckingFavorite(true)
    try {
      const newFavoriteStatus = await toggleFavorite(property.id)
      setIsFavorited(newFavoriteStatus)
      toast({
        title: newFavoriteStatus ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteStatus
          ? "Property has been added to your favorites."
          : "Property has been removed from your favorites."
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCheckingFavorite(false)
    }
  }

  // Format price with proper handling of NaN
  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Price not available'
    return `$${price.toLocaleString()}`
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-[4/3]">
          <Image
            src={property.imageUrls?.[0] || "/placeholder.svg"}
            alt={property.title || "Property image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-white/80 hover:bg-white",
              isFavorited && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavoriteClick}
            disabled={favoriteLoading || isCheckingFavorite}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorited ? "fill-current" : "fill-none"
              )}
            />
          </Button>
          <CompareButton property={property} />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Ruler className="h-4 w-4 mr-1" />
                <span>{property.area ? `${property.area} sq ft` : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#002f6c]">
              {formatPrice(property.price)}
              <span className="text-sm font-normal text-gray-600">/month</span>
            </p>
            <p className="text-sm text-gray-600">
              {property.distance ? `${property.distance}km from UTech` : 'Distance not available'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
