import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, X } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"

interface ProfilePictureUploadProps {
    currentPhotoURL?: string
    displayName?: string
    email?: string
    onUploadComplete: (url: string) => Promise<void>
}

export function ProfilePictureUpload({
    currentPhotoURL,
    displayName,
    email,
    onUploadComplete
}: ProfilePictureUploadProps) {
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (result: any) => {
        if (result.event === "success") {
            setIsUploading(true)
            try {
                await onUploadComplete(result.info.secure_url)
                toast({
                    title: "Success",
                    description: "Profile picture updated successfully",
                })
            } catch (error) {
                console.error("Error updating profile picture:", error)
                toast({
                    title: "Error",
                    description: "Failed to update profile picture. Please try again.",
                    variant: "destructive"
                })
            } finally {
                setIsUploading(false)
            }
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
                <AvatarImage src={currentPhotoURL} />
                <AvatarFallback className="bg-[#002f6c] text-white text-3xl">
                    {displayName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <CldUploadWidget
                uploadPreset="utech-housing"
                options={{
                    maxFiles: 1,
                    resourceType: "image",
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                    maxFileSize: 5000000, // 5MB
                    showAdvancedOptions: true,
                    cropping: true,
                    showSkipCropButton: false,
                    croppingAspectRatio: 1,
                    croppingDefaultSelectionRatio: 0.9,
                    croppingShowDimensions: true,
                    styles: {
                        palette: {
                            window: "#002f6c",
                            windowBorder: "#002f6c",
                            tabIcon: "#ffffff",
                            menuIcons: "#ffffff",
                            textDark: "#000000",
                            textLight: "#ffffff",
                            link: "#ffffff",
                            action: "#ffffff",
                            inactiveTabIcon: "#ffffff",
                            error: "#ff0000",
                            inProgress: "#ffffff",
                            complete: "#ffffff",
                            sourceBg: "#ffffff"
                        }
                    }
                }}
                onUpload={handleUpload}
            >
                {({ open }) => (
                    <Button
                        onClick={() => open()}
                        disabled={isUploading}
                        className="w-full sm:w-auto"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                {currentPhotoURL ? "Change Photo" : "Upload Photo"}
                            </>
                        )}
                    </Button>
                )}
            </CldUploadWidget>

            {currentPhotoURL && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={async () => {
                        setIsUploading(true)
                        try {
                            await onUploadComplete("")
                            toast({
                                title: "Success",
                                description: "Profile picture removed successfully",
                            })
                        } catch (error) {
                            console.error("Error removing profile picture:", error)
                            toast({
                                title: "Error",
                                description: "Failed to remove profile picture. Please try again.",
                                variant: "destructive"
                            })
                        } finally {
                            setIsUploading(false)
                        }
                    }}
                    disabled={isUploading}
                >
                    <X className="h-4 w-4 mr-2" />
                    Remove Photo
                </Button>
            )}
        </div>
    )
} 