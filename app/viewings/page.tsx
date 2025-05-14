"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ViewingHistory } from "@/components/profile/viewing-history"

export default function ViewingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

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
        <div className="min-h-screen bg-[#f5f7fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#002f6c] mb-2">Viewing History</h1>
                        <p className="text-gray-600">Track and analyze your property viewing activity</p>
                    </div>

                    <ViewingHistory />
                </div>
            </div>
        </div>
    )
} 