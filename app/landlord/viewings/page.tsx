"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Users, MessageSquare, Calendar, Settings, LogOut, MoreHorizontal, Check, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useViewings } from "@/hooks/use-viewings"
import { useProperties } from "@/hooks/use-properties"
import { Badge } from "@/components/ui/badge"

export default function ViewingsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const { getLandlordViewings, updateViewingStatus, loading, error } = useViewings()
    const { getLandlordProperties } = useProperties()
    const [viewings, setViewings] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState("upcoming")

    useEffect(() => {
        const loadViewings = async () => {
            try {
                // Get landlord's properties
                const properties = await getLandlordProperties()
                const propertyIds = properties.map(p => p.id)

                // Get viewings for these properties
                const viewingsData = await getLandlordViewings(propertyIds)
                setViewings(viewingsData)
            } catch (error) {
                console.error("Error loading viewings:", error)
                toast({
                    title: "Error",
                    description: "Failed to load viewings. Please try again.",
                    variant: "destructive"
                })
            }
        }

        if (user) {
            loadViewings()
        }
    }, [user, getLandlordViewings, getLandlordProperties, toast])

    const handleStatusUpdate = async (viewingId: string, status: 'confirmed' | 'cancelled') => {
        try {
            await updateViewingStatus(viewingId, status)
            setViewings(prev => prev.map(viewing =>
                viewing.id === viewingId ? { ...viewing, status } : viewing
            ))
            toast({
                title: "Success",
                description: `Viewing ${status} successfully.`,
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
            <div className="flex">
                {/* Sidebar */}
                <div className="hidden md:flex w-64 flex-col bg-white h-screen fixed border-r">
                    <div className="p-4 border-b">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#002f6c] flex items-center justify-center">
                                <Home className="text-white h-4 w-4" />
                            </div>
                            <span className="font-bold text-lg text-[#002f6c]">UTechHousing</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/landlord/dashboard"
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
                                >
                                    <Home className="h-5 w-5" />
                                    <span>Properties</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord/tenants"
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
                                >
                                    <Users className="h-5 w-5" />
                                    <span>Tenants</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord/messages"
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Messages</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord/viewings"
                                    className="flex items-center gap-3 p-2 rounded-md bg-[#002f6c]/10 text-[#002f6c] font-medium"
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Viewings</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord/settings"
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="p-4 border-t">
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 md:ml-64">
                    <header className="bg-white border-b p-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold text-[#002f6c]">Property Viewings</h1>
                        </div>
                    </header>

                    <div className="p-6">
                        <Tabs defaultValue="upcoming" className="space-y-6" onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full max-w-md">
                                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                            </TabsList>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                                    {error}
                                </div>
                            ) : filteredViewings.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-600">No viewings found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredViewings.map((viewing) => (
                                        <Card key={viewing.id}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium text-lg">{viewing.propertyTitle}</h3>
                                                        <p className="text-sm text-gray-600">{viewing.propertyLocation}</p>
                                                        <p className="text-sm text-gray-600">{viewing.userName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(viewing.date).toLocaleDateString()} at {viewing.time}
                                                        </p>
                                                        {viewing.notes && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                <span className="font-medium">Notes:</span> {viewing.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {viewing.status === "pending" && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-green-600 border-green-600 hover:bg-green-50"
                                                                onClick={() => handleStatusUpdate(viewing.id, "confirmed")}
                                                            >
                                                                <Check className="h-4 w-4 mr-2" />
                                                                Confirm
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                                                onClick={() => handleStatusUpdate(viewing.id, "cancelled")}
                                                            >
                                                                <X className="h-4 w-4 mr-2" />
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {viewing.status === "confirmed" && (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Confirmed
                                                        </Badge>
                                                    )}
                                                    {viewing.status === "cancelled" && (
                                                        <Badge className="bg-red-100 text-red-800">
                                                            Cancelled
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
} 