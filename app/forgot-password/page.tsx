"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const validateEmail = (email: string) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        if (!email.trim()) {
            setError("Email is required")
            return
        }

        if (!validateEmail(email)) {
            setError("Invalid email address")
            return
        }

        setLoading(true)
        try {
            await resetPassword(email)
            setSuccess(true)
            toast({
                title: "Password reset email sent",
                description: "Please check your email for instructions to reset your password.",
            })
        } catch (error) {
            console.error("Password reset error:", error)
            setError(error instanceof Error ? error.message : "Failed to send reset email")
            toast({
                title: "Error",
                description: "Failed to send password reset email. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#002f6c] mb-2">Forgot Password</h1>
                            <p className="text-gray-600">
                                Enter your email address and we'll send you instructions to reset your password
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8">
                            {success ? (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <Mail className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
                                    <p className="text-gray-600">
                                        We've sent password reset instructions to {email}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setSuccess(false)}
                                    >
                                        Try another email
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className={`pl-10 ${error ? "border-red-500" : ""}`}
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-sm text-red-500">{error}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#002f6c] hover:bg-[#002f6c]/90"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Remember your password?{" "}
                                            <Link href="/login" className="text-[#002f6c] hover:underline">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
} 