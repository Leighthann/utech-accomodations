"use client"

import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/auth-context'
import { ComparisonProvider } from '@/contexts/comparison-context'
import Navigation from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ComparisonProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />

              <main className="flex-1">
                {children}
              </main>

              <footer className="bg-[#002f6c] text-white py-8">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-bold text-lg mb-4">UTechHousing</h3>
                      <p className="text-sm text-gray-300">
                        The premier platform for UTech students to find their perfect off-campus housing.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/properties" className="text-sm text-gray-300 hover:text-white">
                            Properties
                          </Link>
                        </li>
                        <li>
                          <Link href="/about" className="text-sm text-gray-300 hover:text-white">
                            About Us
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="text-sm text-gray-300 hover:text-white">
                            Contact
                          </Link>
                        </li>
                        <li>
                          <Link href="/faq" className="text-sm text-gray-300 hover:text-white">
                            FAQs
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">For Landlords</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/landlord/list-property" className="text-sm text-gray-300 hover:text-white">
                            List Property
                          </Link>
                        </li>
                        <li>
                          <Link href="/landlord/login" className="text-sm text-gray-300 hover:text-white">
                            Landlord Login
                          </Link>
                        </li>
                        <li>
                          <Link href="/landlord/resources" className="text-sm text-gray-300 hover:text-white">
                            Resources
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                      <address className="not-italic text-sm text-gray-300">
                        <p>University of Technology, Jamaica</p>
                        <p>237 Old Hope Road, Kingston 6</p>
                        <p>Jamaica, West Indies</p>
                        <p className="mt-2">Email: info@utechhousing.com</p>
                      </address>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} UTechHousing. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </ComparisonProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
