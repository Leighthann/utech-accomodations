import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Plus, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

interface PropertyComparisonProps {
    properties: Property[]
    onRemoveProperty: (propertyId: string) => void
}

export function PropertyComparison({
    properties,
    onRemoveProperty
}: PropertyComparisonProps) {
    const router = useRouter()

    if (properties.length === 0) {
        return (
            <Card className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">No Properties Selected</h3>
                <p className="text-muted-foreground mb-4">
                    Add properties to compare their features side by side
                </p>
                <Button
                    onClick={() => router.push('/properties')}
                    className="inline-flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Browse Properties
                </Button>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Property Comparison</h2>
                <Button
                    variant="outline"
                    onClick={() => router.push('/properties')}
                    className="inline-flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add More Properties
                </Button>
            </div>

            <ScrollArea className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                        <Card key={property.id} className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 z-10"
                                onClick={() => onRemoveProperty(property.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="relative h-48 w-full">
                                <Image
                                    src={property.images?.[0] || "/placeholder.svg"}
                                    alt={property.title || "Property image"}
                                    fill
                                    className="object-cover rounded-t-lg"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold mb-2">{property.title || "Untitled Property"}</h3>
                                <p className="text-2xl font-bold text-primary mb-2">
                                    ${property.price?.toLocaleString() || "N/A"}/mo
                                </p>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Beds</p>
                                        <p className="font-semibold">{property.bedrooms || "N/A"}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Baths</p>
                                        <p className="font-semibold">{property.bathrooms || "N/A"}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Area</p>
                                        <p className="font-semibold">{property.area ? `${property.area} sqft` : "N/A"}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-semibold">Type:</span>{' '}
                                        {property.propertyType || "Not specified"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Location:</span>{' '}
                                        {property.location || "Location not specified"}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Amenities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(property.amenities || []).map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    className="w-full mt-4"
                                >
                                    <Link href={`/properties/${property.id}`}>
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
} 