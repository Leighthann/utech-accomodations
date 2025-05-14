import Link from "next/link"
import { Search, MapPin, Building, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyCard from "@/components/property-card"
import { properties } from "@/lib/data"

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-[#002f6c] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Student Home Near UTech</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover affordable, convenient, and comfortable off-campus housing options tailored for UTech students.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
                  <Input placeholder="Search by location, property name..." className="pl-10 bg-[#f5f7fa]" />
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="w-full bg-[#f5f7fa] text-gray-700">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-20000">$0 - $20,000</SelectItem>
                    <SelectItem value="20000-40000">$20,000 - $40,000</SelectItem>
                    <SelectItem value="40000-60000">$40,000 - $60,000</SelectItem>
                    <SelectItem value="60000+">$60,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="w-full bg-[#f5f7fa] text-gray-700">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4+">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <Button className="w-full bg-[#fdb813] hover:bg-[#fdb813]/90 text-[#002f6c] font-bold">
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 md:py-16 bg-[#f5f7fa]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c]">Featured Properties</h2>
            <Link href="/properties">
              <Button variant="outline" className="border-[#002f6c] text-[#002f6c]">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#002f6c] mb-12">Why Choose UTechHousing</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#002f6c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#002f6c]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#002f6c]">Convenient Locations</h3>
              <p className="text-gray-600">
                Find housing options within walking distance or a short commute to UTech campus.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#002f6c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-[#002f6c]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#002f6c]">Verified Listings</h3>
              <p className="text-gray-600">
                All properties are verified to ensure they meet student housing standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#002f6c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#002f6c]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#002f6c]">Student Community</h3>
              <p className="text-gray-600">
                Connect with fellow students and find roommates for shared accommodations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#002f6c] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Landlord?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            List your property on UTechHousing and connect with reliable student tenants from the University of
            Technology, Jamaica.
          </p>
          <Link href="/landlord/list-property">
            <Button className="bg-[#fdb813] hover:bg-[#fdb813]/90 text-[#002f6c] font-bold px-8">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
