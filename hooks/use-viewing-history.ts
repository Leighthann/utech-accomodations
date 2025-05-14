import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase/config"
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore"

export interface ViewingHistory {
    id: string
    propertyId: string
    propertyTitle: string
    propertyImage: string
    viewedAt: Timestamp
    userId: string
    duration: number // in seconds
}

export function useViewingHistory() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [history, setHistory] = useState<ViewingHistory[]>([])

    const addView = async (propertyData: {
        propertyId: string
        propertyTitle: string
        propertyImage: string
        duration: number
    }) => {
        if (!user) return

        try {
            const viewingHistoryRef = collection(db, "viewingHistory")
            await addDoc(viewingHistoryRef, {
                ...propertyData,
                userId: user.uid,
                viewedAt: serverTimestamp()
            })
        } catch (error) {
            console.error("Error adding viewing history:", error)
            setError("Failed to record viewing history")
        }
    }

    const getRecentViews = async (limit: number = 10) => {
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            const viewingHistoryRef = collection(db, "viewingHistory")
            const q = query(
                viewingHistoryRef,
                where("userId", "==", user.uid),
                orderBy("viewedAt", "desc"),
                limit(limit)
            )

            const querySnapshot = await getDocs(q)
            const viewingHistory: ViewingHistory[] = []

            querySnapshot.forEach((doc) => {
                viewingHistory.push({
                    id: doc.id,
                    ...doc.data()
                } as ViewingHistory)
            })

            setHistory(viewingHistory)
        } catch (error) {
            console.error("Error fetching viewing history:", error)
            setError("Failed to fetch viewing history")
        } finally {
            setLoading(false)
        }
    }

    const getViewingStats = async () => {
        if (!user) return null

        setLoading(true)
        setError(null)

        try {
            const viewingHistoryRef = collection(db, "viewingHistory")
            const q = query(
                viewingHistoryRef,
                where("userId", "==", user.uid)
            )

            const querySnapshot = await getDocs(q)
            const stats = {
                totalViews: querySnapshot.size,
                averageDuration: 0,
                mostViewedProperty: null as ViewingHistory | null,
                viewsByDay: {} as Record<string, number>
            }

            let totalDuration = 0
            const propertyViews = new Map<string, number>()

            querySnapshot.forEach((doc) => {
                const data = doc.data() as ViewingHistory
                totalDuration += data.duration

                // Count views by property
                const currentCount = propertyViews.get(data.propertyId) || 0
                propertyViews.set(data.propertyId, currentCount + 1)

                // Count views by day
                const date = data.viewedAt.toDate().toISOString().split("T")[0]
                stats.viewsByDay[date] = (stats.viewsByDay[date] || 0) + 1
            })

            // Calculate average duration
            stats.averageDuration = totalDuration / stats.totalViews

            // Find most viewed property
            let maxViews = 0
            propertyViews.forEach((views, propertyId) => {
                if (views > maxViews) {
                    maxViews = views
                    stats.mostViewedProperty = history.find(h => h.propertyId === propertyId) || null
                }
            })

            return stats
        } catch (error) {
            console.error("Error fetching viewing stats:", error)
            setError("Failed to fetch viewing statistics")
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            getRecentViews()
        }
    }, [user])

    return {
        history,
        loading,
        error,
        addView,
        getRecentViews,
        getViewingStats
    }
} 