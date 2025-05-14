"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { PropertyAnalytics } from "@/components/landlord/property-analytics"

export default function AnalyticsPage() {
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
                <h1 className="text-3xl font-bold text-[#002f6c]">Property Analytics</h1>
                <p className="text-gray-600 mt-2">
                    Track your property performance and gain insights into viewer engagement
                </p>
            </div>

            <PropertyAnalytics />
        </div>
    )
} 