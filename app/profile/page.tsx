"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useProfile, type UserProfile } from "@/hooks/use-profile"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, Bell, Shield, Heart, MapPin, Building } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileCompletion } from "@/components/profile/profile-completion"
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

interface FormErrors {
    [key: string]: string;
}

const DEFAULT_PREFERENCES = {
    emailNotifications: true,
    pushNotifications: true,
    searchRadius: 3,
    priceRange: {
        min: 0,
        max: 100000
    },
    propertyTypes: [],
    amenities: [],
    notificationTypes: {
        messages: true,
        propertyUpdates: true,
        priceChanges: true,
        newListings: true
    }
}

export default function ProfilePage() {
    const router = useRouter()
    const { user, loading: authLoading, updateUserProfile } = useAuth()
    const { getProfile, updateProfile, updatePreferences, loading, error } = useProfile()
    const { toast } = useToast()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [activeTab, setActiveTab] = useState("general")
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phone: "",
        userType: "",
        studentId: "",
        department: ""
    })
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) {
            loadProfile()
        }
    }, [user])

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        } else if (user) {
            setFormData({
                displayName: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                userType: user.userType || "",
                studentId: user.studentId || "",
                department: user.department || ""
            })
        }
    }, [user, loading, router])

    const loadProfile = async () => {
        try {
            const userProfile = await getProfile()
            setProfile(userProfile)
        } catch (error) {
            console.error("Error loading profile:", error)
            toast({
                title: "Error",
                description: "Failed to load profile. Please try again.",
                variant: "destructive"
            })
        }
    }

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!profile) return false

        if (!profile.displayName?.trim()) {
            errors.displayName = "Display name is required"
        }

        if (profile.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(profile.phoneNumber)) {
            errors.phoneNumber = "Please enter a valid phone number"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please check the form for errors",
                variant: "destructive"
            })
            return
        }

        setIsSaving(true)
        try {
            await updateProfile({
                displayName: profile.displayName,
                phoneNumber: profile.phoneNumber
            })
            await updateUserProfile({
                displayName: profile.displayName
            })
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handlePreferencesUpdate = async (preferences: Partial<UserProfile['preferences']>) => {
        try {
            await updatePreferences(preferences)
            toast({
                title: "Success",
                description: "Preferences updated successfully",
            })
        } catch (error) {
            console.error("Error updating preferences:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update preferences",
                variant: "destructive"
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (!user) return

            const userRef = doc(db, "users", user.uid)
            await updateDoc(userRef, {
                displayName: formData.displayName,
                phoneNumber: formData.phone,
                userType: formData.userType,
                studentId: formData.studentId,
                department: formData.department,
                updatedAt: new Date().toISOString()
            })

            toast({
                title: "Success",
                description: "Profile updated successfully"
            })
            setIsEditing(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
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

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
            </div>
        )
    }

    const preferences = profile.preferences || DEFAULT_PREFERENCES

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#002f6c] mb-2">Profile Settings</h1>
                        <p className="text-gray-600">Manage your account settings and preferences</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <ProfileCompletion profile={profile} />
                        </div>
                        <div>
                            <ProfilePictureUpload
                                currentPhotoURL={profile.photoURL}
                                displayName={profile.displayName}
                                email={profile.email}
                                onUploadComplete={async (url) => {
                                    await updateProfile({ photoURL: url })
                                    await updateUserProfile({ photoURL: url })
                                }}
                            />
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-4">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Preferences
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Information</CardTitle>
                                    <CardDescription>Update your personal information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="flex items-center gap-4 mb-6">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={profile.photoURL || undefined} />
                                                <AvatarFallback className="bg-[#002f6c] text-white text-xl">
                                                    {profile.displayName?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">{profile.displayName || "Set your display name"}</h3>
                                                <p className="text-sm text-gray-500">{profile.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="bg-gray-50"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">Email cannot be changed</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="displayName"
                                                    value={formData.displayName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                                    placeholder="Enter your display name"
                                                    className={formErrors.displayName ? "border-red-500" : ""}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {formErrors.displayName && (
                                                <p className="text-sm text-red-500">{formErrors.displayName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <Input
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                    placeholder="Enter your phone number"
                                                    className={formErrors.phoneNumber ? "border-red-500" : ""}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            {formErrors.phoneNumber && (
                                                <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="userType">Account Type</Label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Select
                                                    value={formData.userType}
                                                    onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}
                                                    disabled={!isEditing}
                                                >
                                                    <SelectTrigger className="pl-10">
                                                        <SelectValue placeholder="Select account type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="student">Student</SelectItem>
                                                        <SelectItem value="landlord">Landlord</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {formData.userType === "student" && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="studentId">Student ID</Label>
                                                    <Input
                                                        id="studentId"
                                                        value={formData.studentId}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                                                        disabled={!isEditing}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Department</Label>
                                                    <Input
                                                        id="department"
                                                        value={formData.department}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-end gap-2">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsEditing(false)
                                                            setFormData({
                                                                displayName: profile.displayName || "",
                                                                email: profile.email || "",
                                                                phone: profile.phoneNumber || "",
                                                                userType: profile.userType || "",
                                                                studentId: profile.studentId || "",
                                                                department: profile.department || ""
                                                            })
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="bg-[#002f6c] hover:bg-[#002f6c]/90"
                                                        disabled={saving}
                                                    >
                                                        {saving ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            "Save Changes"
                                                        )}
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    className="bg-[#002f6c] hover:bg-[#002f6c]/90"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    Edit Profile
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Search Preferences</CardTitle>
                                    <CardDescription>Customize your property search preferences</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Search Radius (km)
                                            </Label>
                                            <Select
                                                value={preferences.searchRadius.toString()}
                                                onValueChange={(value) => handlePreferencesUpdate({ searchRadius: parseInt(value) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select search radius" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1 km</SelectItem>
                                                    <SelectItem value="2">2 km</SelectItem>
                                                    <SelectItem value="3">3 km</SelectItem>
                                                    <SelectItem value="5">5 km</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Price Range (JMD)</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="minPrice" className="text-sm text-gray-500">Minimum</Label>
                                                    <Input
                                                        id="minPrice"
                                                        type="number"
                                                        value={preferences.priceRange.min}
                                                        onChange={(e) => handlePreferencesUpdate({
                                                            priceRange: {
                                                                ...preferences.priceRange,
                                                                min: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        placeholder="Min price"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="maxPrice" className="text-sm text-gray-500">Maximum</Label>
                                                    <Input
                                                        id="maxPrice"
                                                        type="number"
                                                        value={preferences.priceRange.max}
                                                        onChange={(e) => handlePreferencesUpdate({
                                                            priceRange: {
                                                                ...preferences.priceRange,
                                                                max: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        placeholder="Max price"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Manage how you receive notifications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Email Notifications</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Receive notifications via email
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={preferences.emailNotifications}
                                                    onCheckedChange={(checked) => {
                                                        handlePreferencesUpdate({
                                                            emailNotifications: checked
                                                        })
                                                    }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Push Notifications</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Receive push notifications in your browser
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={preferences.pushNotifications}
                                                    onCheckedChange={(checked) => {
                                                        handlePreferencesUpdate({
                                                            pushNotifications: checked
                                                        })
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <Label>Notification Types</Label>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm">New Messages</Label>
                                                            <p className="text-sm text-gray-500">
                                                                Get notified when you receive new messages
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={preferences.notificationTypes?.messages ?? true}
                                                            onCheckedChange={(checked) => {
                                                                handlePreferencesUpdate({
                                                                    notificationTypes: {
                                                                        ...preferences.notificationTypes,
                                                                        messages: checked
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm">Property Updates</Label>
                                                            <p className="text-sm text-gray-500">
                                                                Get notified about changes to your saved properties
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={preferences.notificationTypes?.propertyUpdates ?? true}
                                                            onCheckedChange={(checked) => {
                                                                handlePreferencesUpdate({
                                                                    notificationTypes: {
                                                                        ...preferences.notificationTypes,
                                                                        propertyUpdates: checked
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm">Price Changes</Label>
                                                            <p className="text-sm text-gray-500">
                                                                Get notified when prices change on your saved properties
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={preferences.notificationTypes?.priceChanges ?? true}
                                                            onCheckedChange={(checked) => {
                                                                handlePreferencesUpdate({
                                                                    notificationTypes: {
                                                                        ...preferences.notificationTypes,
                                                                        priceChanges: checked
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm">New Listings</Label>
                                                            <p className="text-sm text-gray-500">
                                                                Get notified about new properties matching your criteria
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={preferences.notificationTypes?.newListings ?? true}
                                                            onCheckedChange={(checked) => {
                                                                handlePreferencesUpdate({
                                                                    notificationTypes: {
                                                                        ...preferences.notificationTypes,
                                                                        newListings: checked
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Manage your account security</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Email Verification</Label>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-500">
                                                    {profile.emailVerified
                                                        ? "Your email is verified"
                                                        : "Please verify your email address"}
                                                </p>
                                                {!profile.emailVerified && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            // Add email verification logic
                                                        }}
                                                    >
                                                        Verify Email
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Change Password</Label>
                                            <div className="space-y-4">
                                                <Input
                                                    type="password"
                                                    placeholder="Current password"
                                                    className="bg-white"
                                                />
                                                <Input
                                                    type="password"
                                                    placeholder="New password"
                                                    className="bg-white"
                                                />
                                                <Input
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    className="bg-white"
                                                />
                                                <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                                    Update Password
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
} 