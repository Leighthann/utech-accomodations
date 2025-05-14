"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, Bath, Ruler, Wifi, Tv, Fan, Utensils, Calendar, Phone, Mail, MessageSquare, Loader2, X, Scale } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProperties } from "@/hooks/use-properties"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useViewings } from "@/hooks/use-viewings"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PropertyCard from "@/components/property-card"
import { MessageBox } from "@/components/message-box"
import { usePropertyComparison } from '@/hooks/use-property-comparison'
import { PropertyReviews } from '@/components/property-reviews'

interface ViewingFormData {
  date: string;
  time: string;
  notes: string;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { searchProperties } = useProperties()
  const { toast } = useToast()
  const [similarProperties, setSimilarProperties] = useState<any[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [isViewingDialogOpen, setIsViewingDialogOpen] = useState(false)
  const [viewingFormData, setViewingFormData] = useState<ViewingFormData>({
    date: "",
    time: "",
    notes: ""
  })
  const { scheduleViewing, loading: viewingLoading } = useViewings()
  const [showMessageBox, setShowMessageBox] = useState(false)
  const { addProperty, comparisonProperties, maxProperties } = usePropertyComparison()

  useEffect(() => {
    loadProperty()
  }, [id])

  useEffect(() => {
    if (property) {
      loadSimilarProperties(property)
    }
  }, [property])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, "properties", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setProperty({ id: docSnap.id, ...docSnap.data() })
      } else {
        setError("Property not found")
      }
    } catch (err) {
      setError("Failed to load property")
      console.error("Error loading property:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadSimilarProperties = async (property: any) => {
    try {
      setLoadingSimilar(true)
      const filters = {
        propertyType: property.propertyType,
        priceRange: {
          min: property.price * 0.8,
          max: property.price * 1.2
        },
        bedrooms: property.bedrooms,
        propertyIds: [property.id] // Exclude current property
      }
      const results = await searchProperties(filters)
      setSimilarProperties(results.slice(0, 3))
    } catch (err) {
      console.error("Error loading similar properties:", err)
    } finally {
      setLoadingSimilar(false)
    }
  }

  const handleViewingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to schedule a viewing.",
        variant: "destructive"
      })
      return
    }

    // Validate form
    if (!viewingFormData.date || !viewingFormData.time) {
      toast({
        title: "Validation Error",
        description: "Please select both date and time for the viewing.",
        variant: "destructive"
      })
      return
    }

    // Validate date is not in the past
    const selectedDate = new Date(viewingFormData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      toast({
        title: "Validation Error",
        description: "Please select a future date for the viewing.",
        variant: "destructive"
      })
      return
    }

    try {
      await scheduleViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        date: viewingFormData.date,
        time: viewingFormData.time,
        notes: viewingFormData.notes
      })

      toast({
        title: "Success",
        description: "Viewing request submitted successfully! The landlord will review your request.",
      })

      setIsViewingDialogOpen(false)
      setViewingFormData({
        date: "",
        time: "",
        notes: ""
      })
    } catch (error) {
      console.error("Error scheduling viewing:", error)
      toast({
        title: "Error",
        description: "Failed to schedule viewing. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleAddToComparison = () => {
    if (comparisonProperties.length >= maxProperties) {
      toast({
        title: 'Maximum Properties Reached',
        description: `You can compare up to ${maxProperties} properties at a time.`,
        variant: 'destructive'
      })
      return
    }

    if (comparisonProperties.some(p => p.id === property.id)) {
      toast({
        title: 'Property Already Added',
        description: 'This property is already in your comparison list.',
        variant: 'destructive'
      })
      return
    }

    addProperty(property)
    toast({
      title: 'Added to Comparison',
      description: 'You can view and compare properties in the comparison page.',
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/compare')}
        >
          View Comparison
        </Button>
      )
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#002f6c] mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Property not found"}</p>
          <Link href="/properties">
            <Button variant="outline" className="border-[#002f6c] text-[#002f6c]">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/properties" className="text-[#002f6c] hover:underline">
              ← Back to listings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Property Images */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="relative h-[400px] md:h-[500px]">
                  <Image
                    src={property.imageUrls?.[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {property.imageUrls && property.imageUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {property.imageUrls.slice(1).map((url: string, index: number) => (
                      <div key={index} className="relative h-24">
                        <Image
                          src={url}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002f6c] mb-2">{property.title}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <p>{property.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-[#002f6c]">${property.price.toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-[#f5f7fa] rounded-lg mb-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-[#002f6c] mb-1">
                      <Bed className="h-5 w-5 mr-1" />
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-[#002f6c] mb-1">
                      <Bath className="h-5 w-5 mr-1" />
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-[#002f6c] mb-1">
                      <Ruler className="h-5 w-5 mr-1" />
                      <span className="font-medium">{property.area}</span>
                    </div>
                    <p className="text-sm text-gray-600">Sq Ft</p>
                  </div>
                </div>

                <Tabs defaultValue="description">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-4">
                    <p className="text-gray-700">{property.description}</p>
                  </TabsContent>

                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(property.amenities || {})
                        .filter(([_, value]) => value)
                        .map(([key]) => (
                          <div key={key} className="flex items-center">
                            <Wifi className="h-5 w-5 text-[#002f6c] mr-2" />
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          </div>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location">
                    <div className="bg-gray-200 rounded-lg h-[300px] flex items-center justify-center">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(property.location)}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="flex items-center text-gray-700 mb-2">
                        <MapPin className="h-5 w-5 text-[#002f6c] mr-2" />
                        {property.location}
                      </p>
                      <p className="text-[#fdb813] font-medium flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {property.distance} km from UTech
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Property Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <PropertyReviews
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#002f6c] mb-6">Similar Properties</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {/* Landlord Contact */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-[#002f6c] mb-4">Contact Landlord</h2>

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#002f6c] rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    {property.landlordName?.[0] || "L"}
                  </div>
                  <div>
                    <p className="font-medium">{property.landlordName || "Landlord"}</p>
                    <p className="text-sm text-gray-600">Property Manager</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    className="w-full bg-[#002f6c] hover:bg-[#002f6c]/90"
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Authentication Required",
                          description: "Please sign in to contact the landlord.",
                          variant: "destructive"
                        })
                        return
                      }
                      // TODO: Implement call functionality
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Landlord
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#002f6c] text-[#002f6c]"
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Authentication Required",
                          description: "Please sign in to contact the landlord.",
                          variant: "destructive"
                        })
                        return
                      }
                      // TODO: Implement email functionality
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Landlord
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#002f6c] text-[#002f6c]"
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Authentication Required",
                          description: "Please sign in to contact the landlord.",
                          variant: "destructive"
                        })
                        return
                      }
                      setShowMessageBox(true)
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>

              {/* Message Box Dialog */}
              <Dialog open={showMessageBox} onOpenChange={setShowMessageBox}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Message Landlord</DialogTitle>
                    <DialogDescription>
                      Send a message to the landlord about this property
                    </DialogDescription>
                  </DialogHeader>
                  <MessageBox
                    propertyId={property.id}
                    otherUserId={property.landlordId}
                    otherUserName={property.landlordName}
                    propertyTitle={property.title}
                  />
                </DialogContent>
              </Dialog>

              {/* Schedule Viewing */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#002f6c] mb-4">Schedule a Viewing</h2>
                <p className="text-gray-600 mb-4">Select a date and time to view this property in person.</p>

                <Dialog open={isViewingDialogOpen} onOpenChange={setIsViewingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-[#fdb813] hover:bg-[#fdb813]/90 text-[#002f6c] font-bold"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Viewing
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule a Viewing</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleViewingSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={viewingFormData.date}
                          onChange={(e) => setViewingFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          required
                          value={viewingFormData.time}
                          onChange={(e) => setViewingFormData(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any specific requirements or questions?"
                          value={viewingFormData.notes}
                          onChange={(e) => setViewingFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsViewingDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#002f6c] hover:bg-[#002f6c]/90"
                          disabled={viewingLoading}
                        >
                          {viewingLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            "Schedule Viewing"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleAddToComparison}
                  className="inline-flex items-center gap-2"
                >
                  <Scale className="h-4 w-4" />
                  Add to Comparison
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
