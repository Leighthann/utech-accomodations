"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useProperties } from '@/hooks/use-properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TestPage() {
    const { user, signIn, signUp, logout } = useAuth()
    const { addProperty, loading, error } = useProperties()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'landlord' | 'student'>('landlord')
    const [images, setImages] = useState<File[]>([])
    const [uploadStatus, setUploadStatus] = useState('')

    const handleSignUp = async () => {
        try {
            await signUp(email, password, role)
            setUploadStatus('Signup successful!')
        } catch (error) {
            setUploadStatus(`Signup error: ${error}`)
        }
    }

    const handleSignIn = async () => {
        try {
            await signIn(email, password)
            setUploadStatus('Login successful!')
        } catch (error) {
            setUploadStatus(`Login error: ${error}`)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setUploadStatus('Logout successful!')
        } catch (error) {
            setUploadStatus(`Logout error: ${error}`)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const fileList = Array.from(e.target.files || []);
        setImages(prev => [...(prev || []), ...fileList].slice(0, 10));
    }

    const handleTestPropertyUpload = async () => {
        try {
            if (!user) {
                setUploadStatus('Please login first!')
                return
            }

            const testProperty = {
                title: "Test Property",
                price: 1000,
                bedrooms: 2,
                bathrooms: 1,
                area: 800,
                distance: 1.5,
                location: "Test Location",
                description: "Test Description",
                propertyType: "apartment",
                availableFrom: "2024-05-01",
                leaseTerm: "12 months",
                deposit: 1000,
                amenities: {
                    wifi: true,
                    parking: true
                }
            }

            const propertyId = await addProperty(testProperty, images)
            setUploadStatus(`Property uploaded successfully! ID: ${propertyId}`)
        } catch (error) {
            setUploadStatus(`Property upload error: ${error}`)
        }
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Test Authentication and Uploads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Select value={role} onValueChange={(value: 'landlord' | 'student') => setRole(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="landlord">Landlord</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button onClick={handleSignUp}>Sign Up</Button>
                            <Button onClick={handleSignIn}>Sign In</Button>
                            <Button onClick={handleLogout} variant="destructive">Logout</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Button onClick={handleTestPropertyUpload} disabled={loading}>
                            {loading ? "Uploading..." : "Test Property Upload"}
                        </Button>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-bold mb-2">Status:</h3>
                        <div className="bg-gray-100 p-4 rounded">
                            <p>User: {user ? user.email : "Not logged in"}</p>
                            <p>Role: {role}</p>
                            <p>Upload Status: {uploadStatus}</p>
                            {error && <p className="text-red-500">Error: {error}</p>}
                            <p>Selected Images: {images.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 