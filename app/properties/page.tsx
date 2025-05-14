"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, SlidersHorizontal, MapPin, Bed, Bath, Ruler, DollarSign, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PropertyCard from "@/components/property-card"
import { useProperties } from "@/hooks/use-properties"
import type { PropertyFilters } from "@/hooks/use-properties"
import { useToast } from "@/components/ui/use-toast"

const AMENITIES = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "ac", label: "Air Conditioning" },
  { id: "furnished", label: "Furnished" },
  { id: "laundry", label: "Laundry" },
  { id: "security", label: "Security" },
  { id: "petFriendly", label: "Pet Friendly" },
  { id: "pool", label: "Pool" },
  { id: "gym", label: "Gym" },
  { id: "cable", label: "Cable TV" },
  { id: "kitchen", label: "Kitchen" },
  { id: "maintenance", label: "Maintenance" },
  { id: "housekeeping", label: "Housekeeping" },
  { id: "studyRoom", label: "Study Room" },
  { id: "garden", label: "Garden" }
]

export default function PropertiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { searchProperties, loading, error } = useProperties()
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({
    searchQuery: searchParams.get("q") || "",
    priceRange: {
      min: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined,
      max: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined
    },
    bedrooms: searchParams.get("bedrooms") ? parseInt(searchParams.get("bedrooms")!) : undefined,
    bathrooms: searchParams.get("bathrooms") ? parseInt(searchParams.get("bathrooms")!) : undefined,
    propertyType: searchParams.get("type") || undefined,
    distance: searchParams.get("distance") ? parseFloat(searchParams.get("distance")!) : undefined,
    amenities: searchParams.get("amenities")?.split(",") || []
  })

  const loadProperties = useCallback(async () => {
    try {
      const results = await searchProperties(filters)
      setProperties(results)
    } catch (error) {
      console.error("Error loading properties:", error)
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive"
      })
    }
  }, [filters, searchProperties, toast])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
  }

  const handlePriceRangeChange = (value: string) => {
    const [min, max] = (value || "").split("-").map(v => {
      const num = Number(v);
      return isNaN(num) ? undefined : num;
    });
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  }

  const handleBedroomsChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: value === "4+" ? 4 : parseInt(value)
    }))
  }

  const handleBathroomsChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      bathrooms: parseInt(value)
    }))
  }

  const handlePropertyTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: value
    }))
  }

  const handleDistanceChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      distance: parseFloat(value)
    }))
  }

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked
        ? [...(prev.amenities || []), amenityId]
        : (prev.amenities || []).filter(id => id !== amenityId)
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      priceRange: {
        min: undefined,
        max: undefined
      },
      bedrooms: undefined,
      bathrooms: undefined,
      propertyType: undefined,
      distance: undefined,
      amenities: []
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "object") return Object.values(value).some(v => v !== undefined)
    return value !== undefined && value !== ""
  }).length

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#002f6c] mb-2">Property Listings</h1>
              <p className="text-gray-600">Find your perfect student accommodation near UTech</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filter Properties</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Price Range (JMD)</Label>
                        <Select
                          value={filters.priceRange?.min && filters.priceRange?.max
                            ? `${filters.priceRange.min}-${filters.priceRange.max}`
                            : undefined}
                          onValueChange={handlePriceRangeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-20000">$0 - $20,000</SelectItem>
                            <SelectItem value="20000-40000">$20,000 - $40,000</SelectItem>
                            <SelectItem value="40000-60000">$40,000 - $60,000</SelectItem>
                            <SelectItem value="60000-100000">$60,000 - $100,000</SelectItem>
                            <SelectItem value="100000-999999">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Select
                          value={filters.bedrooms?.toString()}
                          onValueChange={handleBedroomsChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Bedroom</SelectItem>
                            <SelectItem value="2">2 Bedrooms</SelectItem>
                            <SelectItem value="3">3 Bedrooms</SelectItem>
                            <SelectItem value="4+">4+ Bedrooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Select
                          value={filters.bathrooms?.toString()}
                          onValueChange={handleBathroomsChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bathrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Bathroom</SelectItem>
                            <SelectItem value="2">2 Bathrooms</SelectItem>
                            <SelectItem value="3">3+ Bathrooms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Property Type</Label>
                        <Select
                          value={filters.propertyType}
                          onValueChange={handlePropertyTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="shared">Shared Room</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Distance from UTech</Label>
                        <Select
                          value={filters.distance?.toString()}
                          onValueChange={handleDistanceChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Within 1km</SelectItem>
                            <SelectItem value="2">Within 2km</SelectItem>
                            <SelectItem value="3">Within 3km</SelectItem>
                            <SelectItem value="5">Within 5km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {AMENITIES.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={amenity.id}
                                checked={filters.amenities?.includes(amenity.id)}
                                onCheckedChange={(checked) =>
                                  handleAmenityChange(amenity.id, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={amenity.id}
                                className="text-sm font-normal"
                              >
                                {amenity.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={clearFilters}
                        >
                          Clear All
                        </Button>
                        <Button
                          className="flex-1 bg-[#002f6c] hover:bg-[#002f6c]/90"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by location, property name..."
                    className="pl-10 bg-[#f5f7fa]"
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div>
                <Select
                  value={filters.priceRange?.min && filters.priceRange?.max
                    ? `${filters.priceRange.min}-${filters.priceRange.max}`
                    : undefined}
                  onValueChange={handlePriceRangeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-20000">$0 - $20,000</SelectItem>
                    <SelectItem value="20000-40000">$20,000 - $40,000</SelectItem>
                    <SelectItem value="40000-60000">$40,000 - $60,000</SelectItem>
                    <SelectItem value="60000-100000">$60,000 - $100,000</SelectItem>
                    <SelectItem value="100000-999999">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.bedrooms?.toString()}
                  onValueChange={handleBedroomsChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4+">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.propertyType}
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="shared">Shared Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {filters.searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {filters.searchQuery}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, searchQuery: "" }))}
                    />
                  </Badge>
                )}
                {filters.priceRange?.min && filters.priceRange?.max && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: undefined, max: undefined } }))}
                    />
                  </Badge>
                )}
                {filters.bedrooms && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.bedrooms} {filters.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, bedrooms: undefined }))}
                    />
                  </Badge>
                )}
                {filters.bathrooms && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.bathrooms} {filters.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, bathrooms: undefined }))}
                    />
                  </Badge>
                )}
                {filters.propertyType && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, propertyType: undefined }))}
                    />
                  </Badge>
                )}
                {filters.distance && (
                  <Badge variant="secondary" className="gap-1">
                    Within {filters.distance}km
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, distance: undefined }))}
                    />
                  </Badge>
                )}
                {filters.amenities?.map(amenity => (
                  <Badge key={amenity} variant="secondary" className="gap-1">
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleAmenityChange(amenity, false)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#002f6c] hover:text-[#002f6c]/90"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? "Loading..." : `Showing ${properties.length} properties`}
            </p>
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Property Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {!loading && properties.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-[#002f6c] border-[#002f6c] hover:bg-[#002f6c] hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
