"use client"

import { useState, useEffect, useRef } from "react"
import { useMessages, Message } from "@/hooks/use-messages"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { format } from "date-fns"

interface MessageBoxProps {
    propertyId: string
    otherUserId: string
    otherUserName: string
    propertyTitle: string
}

export function MessageBox({
    propertyId,
    otherUserId,
    otherUserName,
    propertyTitle
}: MessageBoxProps) {
    const { user } = useAuth()
    const { sendMessage, getMessages, markAsRead, loading } = useMessages()
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user) return

        const unsubscribe = getMessages(propertyId, otherUserId, (updatedMessages) => {
            setMessages(updatedMessages)
            // Mark unread messages as read
            updatedMessages.forEach(message => {
                if (!message.read && message.receiverId === user.uid) {
                    markAsRead(message.id)
                }
            })
        })

        return () => unsubscribe()
    }, [user, propertyId, otherUserId, getMessages, markAsRead])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMessage.trim()) return

        try {
            await sendMessage(otherUserId, propertyId, newMessage.trim())
            setNewMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            })
        }
    }

    if (!user) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Landlord</h3>
                <p className="text-gray-600 mb-4">
                    Please sign in to send messages to the landlord.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
                Message {otherUserName} about {propertyTitle}
            </h3>

            <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.senderId === user.uid ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.senderId === user.uid
                                ? "bg-[#002f6c] text-white"
                                : "bg-gray-100"
                                }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                                {message.timestamp &&
                                    format(message.timestamp.toDate(), "MMM d, h:mm a")}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
                <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="resize-none"
                    rows={3}
                />
                <Button
                    type="submit"
                    className="w-full bg-[#002f6c] hover:bg-[#002f6c]/90"
                    disabled={loading || !newMessage.trim()}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
} 