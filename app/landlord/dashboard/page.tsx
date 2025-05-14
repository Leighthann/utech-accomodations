"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLandlord } from "@/hooks/use-landlord"
import { useViewings } from "@/hooks/use-viewings"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Home, Calendar, Users, Plus, Edit, Trash2, Check, X } from "lucide-react"
import Image from "next/image"

export default function LandlordDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { getLandlordProperties, updatePropertyStatus, deleteProperty, loading: propertiesLoading, error: propertiesError } = useLandlord()
  const { getLandlordViewings, updateViewingStatus, loading: viewingsLoading, error: viewingsError } = useViewings()
  const { toast } = useToast()
  const [properties, setProperties] = useState<any[]>([])
  const [viewings, setViewings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("properties")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [propertiesData, viewingsData] = await Promise.all([
        getLandlordProperties(),
        getLandlordViewings(properties.map(p => p.id))
      ])
      setProperties(propertiesData)
      setViewings(viewingsData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleStatusUpdate = async (propertyId: string, status: 'active' | 'inactive' | 'rented') => {
    try {
      await updatePropertyStatus(propertyId, status)
      setProperties(properties.map(property =>
        property.id === propertyId
          ? { ...property, status }
          : property
      ))
      toast({
        title: "Success",
        description: "Property status updated successfully",
      })
    } catch (error) {
      console.error("Error updating property status:", error)
      toast({
        title: "Error",
        description: "Failed to update property status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      setDeletingId(propertyId)
      await deleteProperty(propertyId)
      setProperties(properties.filter(property => property.id !== propertyId))
      toast({
        title: "Success",
        description: "Property deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewingStatusUpdate = async (viewingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateViewingStatus(viewingId, status)
      setViewings(viewings.map(viewing =>
        viewing.id === viewingId
          ? { ...viewing, status }
          : viewing
      ))
      toast({
        title: "Success",
        description: `Viewing ${status} successfully`,
      })
    } catch (error) {
      console.error("Error updating viewing status:", error)
      toast({
        title: "Error",
        description: "Failed to update viewing status. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Protect the route
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const filteredViewings = viewings.filter(viewing => {
    switch (activeTab) {
      case "upcoming":
        return viewing.status === "pending" || viewing.status === "confirmed"
      case "completed":
        return viewing.status === "completed"
      case "cancelled":
        return viewing.status === "cancelled"
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#002f6c] mb-2">Landlord Dashboard</h1>
              <p className="text-gray-600">Manage your properties and viewing requests</p>
            </div>
            <Button
              onClick={() => router.push("/landlord/list-property")}
              className="bg-[#002f6c] hover:bg-[#002f6c]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              List New Property
            </Button>
          </div>

          {(propertiesError || viewingsError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {propertiesError || viewingsError}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Viewings
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {propertiesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                </div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id}>
                      <div className="relative h-48">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <Badge
                          variant={
                            property.status === "active"
                              ? "default"
                              : property.status === "rented"
                                ? "secondary"
                                : "destructive"
                          }
                          className="absolute top-2 right-2"
                        >
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{property.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>{property.propertyType}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-2xl font-bold text-[#002f6c]">
                            ${property.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">per month</p>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push(`/landlord/properties/${property.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletingId === property.id}
                          >
                            {deletingId === property.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Property
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No Properties Listed</h2>
                  <p className="text-gray-600 mb-6">
                    Start by listing your first property to attract potential tenants.
                  </p>
                  <Button
                    onClick={() => router.push("/landlord/list-property")}
                    className="bg-[#002f6c] hover:bg-[#002f6c]/90"
                  >
                    List New Property
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value={activeTab}>
              {viewingsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                </div>
              ) : filteredViewings.length > 0 ? (
                <div className="space-y-4">
                  {filteredViewings.map((viewing) => (
                    <Card key={viewing.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{viewing.propertyTitle}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center gap-2 mt-2">
                                <Users className="h-4 w-4" />
                                <span>{viewing.userName}</span>
                                <Calendar className="h-4 w-4 ml-4" />
                                <span>{new Date(viewing.date).toLocaleDateString()}</span>
                              </div>
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              viewing.status === "confirmed"
                                ? "default"
                                : viewing.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {viewing.notes && (
                          <p className="text-gray-600 mb-4">{viewing.notes}</p>
                        )}
                        {viewing.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-[#002f6c] hover:bg-[#002f6c]/90"
                              onClick={() => handleViewingStatusUpdate(viewing.id, "confirmed")}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleViewingStatusUpdate(viewing.id, "cancelled")}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">No Viewings Found</h2>
                  <p className="text-gray-600 mb-6">
                    {activeTab === "upcoming"
                      ? "You don't have any upcoming viewings."
                      : activeTab === "completed"
                        ? "You don't have any completed viewings yet."
                        : "You don't have any cancelled viewings."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
