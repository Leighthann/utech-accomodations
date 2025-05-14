"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { SavedSearches } from "@/components/saved-searches"

export default function SavedSearchesPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
            </div>
        )
    }

    if (!user) {
        router.push("/login")
        return null
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#002f6c]">Saved Searches</h1>
                <p className="text-gray-600 mt-2">
                    Manage your saved property searches and notification preferences
                </p>
            </div>

            <SavedSearches />
        </div>
    )
} 