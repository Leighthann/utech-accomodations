"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Building, User, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function Navigation() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const { toast } = useToast()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await logout()
            toast({
                title: "Logged out successfully",
                description: "You have been signed out of your account.",
            })
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            toast({
                title: "Error",
                description: "Failed to log out. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <header className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#002f6c] flex items-center justify-center">
                        <Building className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl text-[#002f6c]">UTechHousing</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/properties" className="text-gray-700 hover:text-[#002f6c]">
                        Properties
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-[#002f6c]">
                        About
                    </Link>
                    <Link href="/contact" className="text-gray-700 hover:text-[#002f6c]">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    <Link href="/landlord/list-property">
                        <Button className="bg-[#fdb813] hover:bg-[#fdb813]/90 text-[#002f6c] font-bold">
                            List Property
                        </Button>
                    </Link>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{user.displayName || user.email}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/favorites">My Favorites</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/landlord/dashboard">Landlord Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600"
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Signing out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-[#002f6c] hover:bg-[#002f6c]/90">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
} 