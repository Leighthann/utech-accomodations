"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLandlord } from "@/hooks/use-landlord"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Home, Upload, ArrowLeft } from "lucide-react"
import Image from "next/image"

const PROPERTY_TYPES = [
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
    "Studio",
    "Loft",
    "Duplex",
    "Other"
]

const AMENITIES = [
    "Parking",
    "Pool",
    "Gym",
    "Laundry",
    "Air Conditioning",
    "Heating",
    "Furnished",
    "Pet Friendly",
    "Balcony",
    "Security",
    "Elevator",
    "Wheelchair Access"
]

export default function ListPropertyPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { addProperty, loading: submitting, error } = useLandlord()
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        propertyType: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        amenities: [] as string[],
        images: [] as string[]
    })

    const [uploadingImages, setUploadingImages] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    const handleImageUpload = async (files: FileList | null) => {
        if (!files) return;
        setUploadingImages(true);
        try {
            const formData = new FormData();
            const imageUrls: string[] = [];

            for (const file of Array.from(files || [])) {
                if (!(file instanceof File)) continue;

                const fileFormData = new FormData();
                fileFormData.append('file', file);
                fileFormData.append('upload_preset', 'utech-housing');

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: fileFormData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                if (typeof data.secure_url === 'string') {
                    imageUrls.push(data.secure_url);
                }
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...imageUrls]
            }));

            toast({
                title: "Success",
                description: "Images uploaded successfully",
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            toast({
                title: "Error",
                description: "Failed to upload images. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to list a property.",
                variant: "destructive"
            })
            return
        }

        try {
            const propertyData = {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseFloat(formData.bathrooms),
                squareFeet: parseInt(formData.squareFeet),
                location: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
                area: parseInt(formData.squareFeet),
                availableFrom: new Date(),
                furnished: formData.amenities.includes("Furnished"),
                petsAllowed: formData.amenities.includes("Pet Friendly"),
                landlordId: user.uid
            }

            await addProperty(propertyData)
            toast({
                title: "Success",
                description: "Property listed successfully",
            })
            router.push("/landlord/dashboard")
        } catch (error) {
            console.error("Error listing property:", error)
            toast({
                title: "Error",
                description: "Failed to list property. Please try again.",
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

    return (
        <div className="min-h-screen bg-[#f5f7fa] py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#002f6c]">List Your Property</CardTitle>
                            <CardDescription>
                                Fill out the form below to list your property for rent
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Property Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter a descriptive title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Describe your property in detail"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="propertyType">Property Type</Label>
                                            <Select
                                                value={formData.propertyType}
                                                onValueChange={(value: string) => handleSelectChange("propertyType", value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select property type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROPERTY_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="price">Monthly Rent ($)</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="Enter monthly rent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="bedrooms">Bedrooms</Label>
                                            <Input
                                                id="bedrooms"
                                                name="bedrooms"
                                                type="number"
                                                value={formData.bedrooms}
                                                onChange={handleInputChange}
                                                placeholder="Number of bedrooms"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="bathrooms">Bathrooms</Label>
                                            <Input
                                                id="bathrooms"
                                                name="bathrooms"
                                                type="number"
                                                value={formData.bathrooms}
                                                onChange={handleInputChange}
                                                placeholder="Number of bathrooms"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="squareFeet">Square Feet</Label>
                                            <Input
                                                id="squareFeet"
                                                name="squareFeet"
                                                type="number"
                                                value={formData.squareFeet}
                                                onChange={handleInputChange}
                                                placeholder="Total square feet"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Address</Label>
                                        <div className="space-y-4">
                                            <Input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Street address"
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="City"
                                                    required
                                                />
                                                <Input
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="State"
                                                    required
                                                />
                                            </div>
                                            <Input
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="ZIP code"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Amenities</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {AMENITIES.map((amenity) => (
                                                <Button
                                                    key={amenity}
                                                    type="button"
                                                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                                                    className="justify-start"
                                                    onClick={() => handleAmenityToggle(amenity)}
                                                >
                                                    {amenity}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Property Images</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <Image
                                                        src={image}
                                                        alt={`Property image ${index + 1}`}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                            <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#002f6c]">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => handleImageUpload(e.target.files)}
                                                    disabled={uploadingImages}
                                                />
                                                {uploadingImages ? (
                                                    <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                                        <span className="text-sm text-gray-500 mt-2">Upload Images</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#002f6c] hover:bg-[#002f6c]/90"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Listing Property...
                                        </>
                                    ) : (
                                        <>
                                            <Home className="h-4 w-4 mr-2" />
                                            List Property
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 