"use client"

import { useState } from "react"
import { useSavedSearches } from "@/hooks/use-saved-searches"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Save } from "lucide-react"

interface SaveSearchDialogProps {
    searchCriteria: {
        minPrice?: number;
        maxPrice?: number;
        minBedrooms?: number;
        maxBedrooms?: number;
        minBathrooms?: number;
        maxBathrooms?: number;
        propertyTypes?: string[];
        amenities?: string[];
        maxDistance?: number;
    };
}

export default function SaveSearchDialog({ searchCriteria }: SaveSearchDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const { saveSearch, loading } = useSavedSearches()
    const { toast } = useToast()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a name for your saved search.",
                variant: "destructive"
            })
            return
        }

        try {
            await saveSearch(name.trim(), searchCriteria)
            toast({
                title: "Success",
                description: "Search criteria saved successfully."
            })
            setOpen(false)
            setName("")
        } catch (error) {
            console.error("Error saving search:", error)
            toast({
                title: "Error",
                description: "Failed to save search criteria. Please try again.",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Search
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save Search Criteria</DialogTitle>
                    <DialogDescription>
                        Give your search a name to save it for later. You'll be notified when new
                        properties match your criteria.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Search Name
                        </label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., UTech Apartments under $1000"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-[#002f6c] hover:bg-[#002f6c]/90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Search
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 