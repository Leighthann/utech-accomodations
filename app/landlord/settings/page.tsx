"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Users, MessageSquare, Calendar, Settings, LogOut, Mail, Phone, Lock, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        app: true,
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
                                    className="flex items-center gap-3 p-2 rounded-md text-gray-600 hover:bg-[#002f6c]/10 hover:text-[#002f6c]"
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Viewings</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/landlord/settings"
                                    className="flex items-center gap-3 p-2 rounded-md bg-[#002f6c]/10 text-[#002f6c] font-medium"
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
                            <h1 className="text-xl font-bold text-[#002f6c]">Settings</h1>
                        </div>
                    </header>

                    <div className="p-6">
                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid grid-cols-3 w-full max-w-md">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>Update your personal information</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" defaultValue="John Doe" className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" defaultValue="+1 (876) 123-4567" className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company Name</Label>
                                            <Input id="company" defaultValue="Doe Properties" className="bg-white" />
                                        </div>
                                        <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">Save Changes</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Preferences</CardTitle>
                                        <CardDescription>Choose how you want to receive notifications</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Email Notifications</Label>
                                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                                            </div>
                                            <Switch
                                                checked={notifications.email}
                                                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>SMS Notifications</Label>
                                                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                            </div>
                                            <Switch
                                                checked={notifications.sms}
                                                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>App Notifications</Label>
                                                <p className="text-sm text-gray-500">Receive notifications in the app</p>
                                            </div>
                                            <Switch
                                                checked={notifications.app}
                                                onCheckedChange={(checked) => setNotifications({ ...notifications, app: checked })}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>Manage your account security</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" className="bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" className="bg-white" />
                                        </div>
                                        <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">Update Password</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
} 