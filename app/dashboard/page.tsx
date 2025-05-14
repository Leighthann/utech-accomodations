"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useSavedSearches } from "@/hooks/use-saved-searches"
import { useViewings } from "@/hooks/use-viewings"
import { useMessages } from "@/hooks/use-messages"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Home, Calendar, MessageSquare, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const { savedSearches, loading: searchesLoading } = useSavedSearches()
    const { viewings, loading: viewingsLoading } = useViewings()
    const { messages, loading: messagesLoading } = useMessages()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [user, router])

    if (searchesLoading || viewingsLoading || messagesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-[#002f6c] mb-8">Dashboard</h1>

                <Tabs defaultValue="saved" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="saved">
                            <Home className="h-4 w-4 mr-2" />
                            Saved Properties
                        </TabsTrigger>
                        <TabsTrigger value="viewings">
                            <Calendar className="h-4 w-4 mr-2" />
                            Scheduled Viewings
                        </TabsTrigger>
                        <TabsTrigger value="messages">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Messages
                        </TabsTrigger>
                        <TabsTrigger value="searches">
                            <Search className="h-4 w-4 mr-2" />
                            Saved Searches
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="saved">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(savedSearches || []).map((search) => (
                                <Card key={search.id}>
                                    <CardHeader>
                                        <div className="relative h-48 mb-4">
                                            <Image
                                                src={search.property?.images?.[0] || "/placeholder.svg"}
                                                alt={search.property?.title || "Property"}
                                                fill
                                                className="object-cover rounded-t-lg"
                                            />
                                        </div>
                                        <CardTitle className="text-xl">{search.property?.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-[#002f6c]">
                                                ${search.property?.price.toLocaleString()}/mo
                                            </p>
                                            <p className="text-gray-600">{search.property?.location}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{search.property?.bedrooms} beds</span>
                                                <span>{search.property?.bathrooms} baths</span>
                                                <span>{search.property?.area} sq ft</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <Link href={`/properties/${search.property?.id}`}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="viewings">
                        <div className="space-y-4">
                            {(viewings || []).map((viewing) => (
                                <Card key={viewing.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{viewing.propertyTitle}</h3>
                                                <p className="text-gray-600">
                                                    {new Date(viewing.date).toLocaleDateString()} at {viewing.time}
                                                </p>
                                                {viewing.notes && (
                                                    <p className="text-gray-600 mt-2">{viewing.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-sm ${viewing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    viewing.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="messages">
                        <div className="space-y-4">
                            {(messages || []).map((message) => (
                                <Card key={message.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{message.otherUserName}</h3>
                                                <p className="text-gray-600">{message.propertyTitle}</p>
                                                <p className="text-gray-700 mt-2">{message.lastMessage}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(message.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="searches">
                        <div className="space-y-4">
                            {(savedSearches || []).map((search) => (
                                <Card key={search.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold">{search.name}</h3>
                                                <div className="text-gray-600 mt-2">
                                                    <p>Property Type: {search.filters.propertyType}</p>
                                                    <p>Price Range: ${search.filters.priceRange.min} - ${search.filters.priceRange.max}</p>
                                                    <p>Bedrooms: {search.filters.bedrooms}</p>
                                                    <p>Bathrooms: {search.filters.bathrooms}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/properties?${new URLSearchParams(search.filters).toString()}`)}
                                                >
                                                    View Results
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 