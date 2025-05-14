"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useProperties } from "@/hooks/use-properties"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function LandlordPropertiesPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProperty, setEditingProperty] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        amenities: {
            wifi: false,
            parking: false,
            airConditioning: false,
            furnished: false,
            security: false,
            pool: false,
            gym: false
        },
        images: [] as string[]
    })

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const propertyData = {
                ...formData,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area: Number(formData.area),
                landlordId: user?.uid,
                landlordName: user?.displayName || "Landlord",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            if (editingProperty) {
                await updateProperty(editingProperty.id, propertyData)
                toast({
                    title: "Success",
                    description: "Property updated successfully"
                })
            } else {
                await addProperty(propertyData)
                toast({
                    title: "Success",
                    description: "Property added successfully"
                })
            }

            setIsDialogOpen(false)
            setEditingProperty(null)
            setFormData({
                title: "",
                description: "",
                price: "",
                location: "",
                propertyType: "",
                bedrooms: "",
                bathrooms: "",
                area: "",
                amenities: {
                    wifi: false,
                    parking: false,
                    airConditioning: false,
                    furnished: false,
                    security: false,
                    pool: false,
                    gym: false
                },
                images: []
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save property",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (propertyId: string) => {
        try {
            await deleteProperty(propertyId)
            toast({
                title: "Success",
                description: "Property deleted successfully"
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete property",
                variant: "destructive"
            })
        }
    }

    const handleEdit = (property: any) => {
        setEditingProperty(property)
        setFormData({
            title: property.title,
            description: property.description,
            price: property.price.toString(),
            location: property.location,
            propertyType: property.propertyType,
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            area: property.area.toString(),
            amenities: property.amenities || {
                wifi: false,
                parking: false,
                airConditioning: false,
                furnished: false,
                security: false,
                pool: false,
                gym: false
            },
            images: property.images || []
        })
        setIsDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#002f6c] mb-4">Error</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#002f6c]">My Properties</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Property
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingProperty ? "Edit Property" : "Add New Property"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price per Month ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="propertyType">Property Type</Label>
                                        <Select
                                            value={formData.propertyType}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="apartment">Apartment</SelectItem>
                                                <SelectItem value="house">House</SelectItem>
                                                <SelectItem value="studio">Studio</SelectItem>
                                                <SelectItem value="townhouse">Townhouse</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bedrooms">Bedrooms</Label>
                                        <Input
                                            id="bedrooms"
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bathrooms">Bathrooms</Label>
                                        <Input
                                            id="bathrooms"
                                            type="number"
                                            value={formData.bathrooms}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="area">Area (sq ft)</Label>
                                        <Input
                                            id="area"
                                            type="number"
                                            value={formData.area}
                                            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Amenities</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(formData.amenities).map(([key, value]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={key}
                                                    checked={value}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        amenities: {
                                                            ...prev.amenities,
                                                            [key]: e.target.checked
                                                        }
                                                    }))}
                                                    className="h-4 w-4 text-[#002f6c]"
                                                />
                                                <Label htmlFor={key} className="capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false)
                                            setEditingProperty(null)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-[#002f6c] hover:bg-[#002f6c]/90">
                                        {editingProperty ? "Update Property" : "Add Property"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(properties || []).map((property) => (
                        <Card key={property.id}>
                            <CardHeader>
                                <div className="relative h-48 mb-4">
                                    <Image
                                        src={property.images?.[0] || "/placeholder.svg"}
                                        alt={property.title}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                </div>
                                <CardTitle className="text-xl">{property.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold text-[#002f6c]">
                                        ${property.price.toLocaleString()}/mo
                                    </p>
                                    <p className="text-gray-600">{property.location}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>{property.bedrooms} beds</span>
                                        <span>{property.bathrooms} baths</span>
                                        <span>{property.area} sq ft</span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(property)}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(property.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
} 