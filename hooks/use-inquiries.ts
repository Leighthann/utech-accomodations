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
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp,
    deleteDoc
} from "firebase/firestore"

export interface Inquiry {
    id: string
    propertyId: string
    propertyTitle: string
    propertyImage: string
    tenantId: string
    tenantName: string
    tenantEmail: string
    tenantPhone?: string
    message: string
    status: "pending" | "responded" | "accepted" | "rejected" | "cancelled"
    createdAt: Timestamp
    updatedAt: Timestamp
    response?: string
    responseAt?: Timestamp
    scheduledViewing?: {
        date: string
        time: string
        status: "pending" | "confirmed" | "completed" | "cancelled"
    }
}

export function useInquiries() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [inquiries, setInquiries] = useState<Inquiry[]>([])

    const getInquiries = async (status?: Inquiry["status"]) => {
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            const inquiriesRef = collection(db, "inquiries")
            let q = query(
                inquiriesRef,
                where("landlordId", "==", user.uid),
                orderBy("createdAt", "desc")
            )

            if (status) {
                q = query(q, where("status", "==", status))
            }

            const querySnapshot = await getDocs(q)
            const inquiriesList: Inquiry[] = []

            querySnapshot.forEach((doc) => {
                inquiriesList.push({
                    id: doc.id,
                    ...doc.data()
                } as Inquiry)
            })

            setInquiries(inquiriesList)
        } catch (error) {
            console.error("Error fetching inquiries:", error)
            setError("Failed to fetch inquiries")
        } finally {
            setLoading(false)
        }
    }

    const respondToInquiry = async (inquiryId: string, response: string) => {
        if (!user) return

        try {
            const inquiryRef = doc(db, "inquiries", inquiryId)
            await updateDoc(inquiryRef, {
                response,
                responseAt: serverTimestamp(),
                status: "responded",
                updatedAt: serverTimestamp()
            })

            // Update local state
            setInquiries(inquiries.map(inquiry =>
                inquiry.id === inquiryId
                    ? {
                        ...inquiry,
                        response,
                        responseAt: Timestamp.now(),
                        status: "responded",
                        updatedAt: Timestamp.now()
                    }
                    : inquiry
            ))
        } catch (error) {
            console.error("Error responding to inquiry:", error)
            throw new Error("Failed to respond to inquiry")
        }
    }

    const updateInquiryStatus = async (inquiryId: string, status: Inquiry["status"]) => {
        if (!user) return

        try {
            const inquiryRef = doc(db, "inquiries", inquiryId)
            await updateDoc(inquiryRef, {
                status,
                updatedAt: serverTimestamp()
            })

            // Update local state
            setInquiries(inquiries.map(inquiry =>
                inquiry.id === inquiryId
                    ? {
                        ...inquiry,
                        status,
                        updatedAt: Timestamp.now()
                    }
                    : inquiry
            ))
        } catch (error) {
            console.error("Error updating inquiry status:", error)
            throw new Error("Failed to update inquiry status")
        }
    }

    const scheduleViewing = async (
        inquiryId: string,
        date: string,
        time: string
    ) => {
        if (!user) return

        try {
            const inquiryRef = doc(db, "inquiries", inquiryId)
            await updateDoc(inquiryRef, {
                scheduledViewing: {
                    date,
                    time,
                    status: "pending"
                },
                updatedAt: serverTimestamp()
            })

            // Update local state
            setInquiries(inquiries.map(inquiry =>
                inquiry.id === inquiryId
                    ? {
                        ...inquiry,
                        scheduledViewing: {
                            date,
                            time,
                            status: "pending"
                        },
                        updatedAt: Timestamp.now()
                    }
                    : inquiry
            ))
        } catch (error) {
            console.error("Error scheduling viewing:", error)
            throw new Error("Failed to schedule viewing")
        }
    }

    const updateViewingStatus = async (
        inquiryId: string,
        viewingStatus: Inquiry["scheduledViewing"]["status"]
    ) => {
        if (!user) return

        try {
            const inquiryRef = doc(db, "inquiries", inquiryId)
            const inquiry = inquiries.find(i => i.id === inquiryId)

            if (!inquiry?.scheduledViewing) {
                throw new Error("No viewing scheduled")
            }

            await updateDoc(inquiryRef, {
                scheduledViewing: {
                    ...inquiry.scheduledViewing,
                    status: viewingStatus
                },
                updatedAt: serverTimestamp()
            })

            // Update local state
            setInquiries(inquiries.map(inquiry =>
                inquiry.id === inquiryId
                    ? {
                        ...inquiry,
                        scheduledViewing: {
                            ...inquiry.scheduledViewing!,
                            status: viewingStatus
                        },
                        updatedAt: Timestamp.now()
                    }
                    : inquiry
            ))
        } catch (error) {
            console.error("Error updating viewing status:", error)
            throw new Error("Failed to update viewing status")
        }
    }

    const getInquiryStats = async () => {
        if (!user) return null

        try {
            const inquiriesRef = collection(db, "inquiries")
            const q = query(
                inquiriesRef,
                where("landlordId", "==", user.uid)
            )

            const querySnapshot = await getDocs(q)
            const stats = {
                total: querySnapshot.size,
                byStatus: {
                    pending: 0,
                    responded: 0,
                    accepted: 0,
                    rejected: 0,
                    cancelled: 0
                },
                byProperty: new Map<string, number>(),
                responseTime: 0
            }

            let totalResponseTime = 0
            let respondedCount = 0

            querySnapshot.forEach((doc) => {
                const data = doc.data() as Inquiry
                stats.byStatus[data.status]++

                // Count by property
                const currentCount = stats.byProperty.get(data.propertyId) || 0
                stats.byProperty.set(data.propertyId, currentCount + 1)

                // Calculate average response time
                if (data.responseAt) {
                    const responseTime = data.responseAt.toMillis() - data.createdAt.toMillis()
                    totalResponseTime += responseTime
                    respondedCount++
                }
            })

            stats.responseTime = respondedCount > 0 ? totalResponseTime / respondedCount : 0

            return stats
        } catch (error) {
            console.error("Error fetching inquiry stats:", error)
            throw new Error("Failed to fetch inquiry statistics")
        }
    }

    useEffect(() => {
        if (user) {
            getInquiries()
        }
    }, [user])

    return {
        inquiries,
        loading,
        error,
        getInquiries,
        respondToInquiry,
        updateInquiryStatus,
        scheduleViewing,
        updateViewingStatus,
        getInquiryStats
    }
} 