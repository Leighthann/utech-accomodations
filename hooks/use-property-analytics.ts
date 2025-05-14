import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase/config"
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp
} from "firebase/firestore"

export interface PropertyAnalytics {
    totalViews: number
    uniqueViewers: number
    averageViewDuration: number
    inquiriesCount: number
    conversionRate: number
    viewsByDay: Record<string, number>
    viewsByProperty: Record<string, number>
    topPerformingProperties: Array<{
        id: string
        title: string
        views: number
        inquiries: number
        conversionRate: number
    }>
    recentActivity: Array<{
        type: "view" | "inquiry" | "scheduled_viewing"
        propertyId: string
        propertyTitle: string
        timestamp: Timestamp
        details: any
    }>
}

export function usePropertyAnalytics() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null)

    const getAnalytics = async (timeRange: "week" | "month" | "year" = "month") => {
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            // Get date range based on timeRange
            const now = new Date()
            const startDate = new Date()
            switch (timeRange) {
                case "week":
                    startDate.setDate(now.getDate() - 7)
                    break
                case "month":
                    startDate.setMonth(now.getMonth() - 1)
                    break
                case "year":
                    startDate.setFullYear(now.getFullYear() - 1)
                    break
            }

            // Fetch viewing history
            const viewingHistoryRef = collection(db, "viewingHistory")
            const viewingQuery = query(
                viewingHistoryRef,
                where("landlordId", "==", user.uid),
                where("viewedAt", ">=", Timestamp.fromDate(startDate))
            )

            // Fetch inquiries
            const inquiriesRef = collection(db, "inquiries")
            const inquiriesQuery = query(
                inquiriesRef,
                where("landlordId", "==", user.uid),
                where("createdAt", ">=", Timestamp.fromDate(startDate))
            )

            const [viewingSnapshot, inquiriesSnapshot] = await Promise.all([
                getDocs(viewingQuery),
                getDocs(inquiriesQuery)
            ])

            // Process viewing data
            const viewsByDay: Record<string, number> = {}
            const viewsByProperty: Record<string, number> = {}
            const uniqueViewers = new Set<string>()
            let totalViewDuration = 0
            let totalViews = 0

            viewingSnapshot.forEach((doc) => {
                const data = doc.data()
                if (!data || !data.viewedAt || !data.propertyId || !data.userId) return;

                const date = data.viewedAt.toDate().toISOString().split("T")[0]
                viewsByDay[date] = (viewsByDay[date] || 0) + 1
                viewsByProperty[data.propertyId] = (viewsByProperty[data.propertyId] || 0) + 1
                uniqueViewers.add(data.userId)
                totalViewDuration += data.duration || 0
                totalViews++
            })

            // Process inquiry data
            const inquiriesByProperty: Record<string, number> = {}
            inquiriesSnapshot.forEach((doc) => {
                const data = doc.data()
                if (!data || !data.propertyId) return;
                inquiriesByProperty[data.propertyId] = (inquiriesByProperty[data.propertyId] || 0) + 1
            })

            // Calculate top performing properties
            const topPerformingProperties = Object.entries(viewsByProperty || {})
                .filter(([propertyId]) => propertyId && typeof propertyId === 'string')
                .map(([propertyId, views]) => ({
                    id: propertyId,
                    title: "Property " + propertyId,
                    views: Math.max(0, views || 0),
                    inquiries: Math.max(0, inquiriesByProperty[propertyId] || 0),
                    conversionRate: views > 0 ? ((inquiriesByProperty[propertyId] || 0) / views) * 100 : 0
                }))
                .sort((a, b) => b.views - a.views)
                .slice(0, Math.min(5, Object.keys(viewsByProperty || {}).length))

            // Calculate overall metrics
            const analytics: PropertyAnalytics = {
                totalViews,
                uniqueViewers: uniqueViewers.size,
                averageViewDuration: totalViews > 0 ? totalViewDuration / totalViews : 0,
                inquiriesCount: inquiriesSnapshot.size,
                conversionRate: totalViews > 0 ? (inquiriesSnapshot.size / totalViews) * 100 : 0,
                viewsByDay,
                viewsByProperty,
                topPerformingProperties,
                recentActivity: [] // You'll need to implement this based on your needs
            }

            setAnalytics(analytics)
        } catch (error) {
            console.error("Error fetching property analytics:", error)
            setError("Failed to fetch property analytics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            getAnalytics()
        }
    }, [user])

    return {
        analytics,
        loading,
        error,
        getAnalytics
    }
} 