"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Users, MessageSquare, Calendar, Settings, LogOut, MoreHorizontal, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TenantsPage() {
    const [activeTab, setActiveTab] = useState("current")

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
                                    className="flex items-center gap-3 p-2 rounded-md bg-[#002f6c]/10 text-[#002f6c] font-medium"
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
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
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
                            <h1 className="text-xl font-bold text-[#002f6c]">Tenant Management</h1>
                        </div>
                    </header>

                    <div className="p-6">
                        <Tabs defaultValue="current" className="space-y-6">
                            <TabsList className="grid grid-cols-3 w-full max-w-md">
                                <TabsTrigger value="current">Current Tenants</TabsTrigger>
                                <TabsTrigger value="pending">Pending Applications</TabsTrigger>
                                <TabsTrigger value="previous">Previous Tenants</TabsTrigger>
                            </TabsList>

                            <TabsContent value="current" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>John Doe</CardTitle>
                                                    <CardDescription>Apartment #123</CardDescription>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500">
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">Lease Start: Jan 1, 2024</p>
                                                <p className="text-sm text-gray-600">Lease End: Dec 31, 2024</p>
                                                <p className="text-sm text-gray-600">Contact: john.doe@email.com</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="pending">
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-600">No pending applications</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="previous">
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-600">No previous tenants</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
} 