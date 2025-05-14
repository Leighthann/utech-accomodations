"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Users, MessageSquare, Calendar, Settings, LogOut, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MessagesPage() {
    const [activeTab, setActiveTab] = useState("inbox")

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
                                    className="flex items-center gap-3 p-2 rounded-md bg-[#002f6c]/10 text-[#002f6c] font-medium"
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
                            <h1 className="text-xl font-bold text-[#002f6c]">Messages</h1>
                        </div>
                    </header>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Message List */}
                            <div className="md:col-span-1 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search messages..."
                                        className="pl-9 bg-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Card className="cursor-pointer hover:bg-gray-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#002f6c] flex items-center justify-center text-white font-bold">
                                                    JD
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium">John Doe</h3>
                                                        <span className="text-xs text-gray-500">2h ago</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        Hi, I'm interested in your property at 123 Hope Road...
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="cursor-pointer hover:bg-gray-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#002f6c] flex items-center justify-center text-white font-bold">
                                                    SJ
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium">Sarah Johnson</h3>
                                                        <span className="text-xs text-gray-500">1d ago</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        When would be a good time to schedule a viewing?
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="md:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#002f6c] flex items-center justify-center text-white font-bold">
                                                JD
                                            </div>
                                            <div>
                                                <CardTitle>John Doe</CardTitle>
                                                <CardDescription>Interested in Apartment #123</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <p className="text-sm text-gray-700">
                                                    Hi, I'm interested in your property at 123 Hope Road. Could you tell me more about the amenities and if it's still available?
                                                </p>
                                                <span className="text-xs text-gray-500">2h ago</span>
                                            </div>

                                            <div className="bg-[#002f6c]/10 rounded-lg p-4">
                                                <p className="text-sm text-gray-700">
                                                    Hello John, thank you for your interest! The property is still available and comes with WiFi, parking, and air conditioning. Would you like to schedule a viewing?
                                                </p>
                                                <span className="text-xs text-gray-500">1h ago</span>
                                            </div>

                                            <div className="bg-gray-100 rounded-lg p-4">
                                                <p className="text-sm text-gray-700">
                                                    Yes, that would be great! What times are available this week?
                                                </p>
                                                <span className="text-xs text-gray-500">30m ago</span>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type your message..."
                                                    className="flex-1 bg-white"
                                                />
                                                <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                                    Send
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 