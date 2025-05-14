"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useMessages } from "@/hooks/use-messages"
import { useProperties } from "@/hooks/use-properties"
import { Button } from "@/components/ui/button"
import { Loader2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Conversation {
    id: string
    propertyId: string
    participants: string[]
    lastMessage: {
        content: string
        timestamp: any
        senderId: string
    }
    unreadCount: number
}

export default function MessagesPage() {
    const { user } = useAuth()
    const { getConversations } = useMessages()
    const { getProperty } = useProperties()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const unsubscribe = getConversations((updatedConversations) => {
            setConversations(updatedConversations)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user, getConversations])

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Sign in to View Messages</h1>
                    <p className="text-gray-600 mb-6">
                        Please sign in to view and manage your messages.
                    </p>
                    <Link href="/auth/login">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#002f6c]" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>

            {conversations.length === 0 ? (
                <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-4">No Messages Yet</h2>
                    <p className="text-gray-600 mb-6">
                        Start browsing properties and send messages to landlords to see them here.
                    </p>
                    <Link href="/properties">
                        <Button>Browse Properties</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {conversations.map((conversation) => (
                        <Link
                            key={conversation.id}
                            href={`/messages/${conversation.propertyId}`}
                            className="block"
                        >
                            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            {conversation.propertyId}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-1">
                                            {conversation.lastMessage.content}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {conversation.lastMessage.timestamp &&
                                                format(
                                                    conversation.lastMessage.timestamp.toDate(),
                                                    "MMM d, h:mm a"
                                                )}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <span className="inline-block bg-[#002f6c] text-white text-xs px-2 py-1 rounded-full mt-1">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
} 