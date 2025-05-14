import { Building, Users, MapPin, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative bg-[#002f6c] text-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">About UTechHousing</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-3xl">
                        Connecting UTech students with quality off-campus housing options since 2024.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            UTechHousing was created to solve the housing challenges faced by University of Technology, Jamaica students.
                            Our platform provides a safe, reliable, and convenient way for students to find quality off-campus housing
                            that meets their needs and budget.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-16 bg-[#f5f7fa]">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] text-center mb-12">Why Choose UTechHousing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Building className="h-12 w-12 text-[#002f6c] mb-4" />
                            <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
                            <p className="text-gray-600">
                                All properties listed on our platform are verified to ensure they meet our quality standards and safety requirements.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Users className="h-12 w-12 text-[#002f6c] mb-4" />
                            <h3 className="text-xl font-bold mb-2">Student-Focused</h3>
                            <p className="text-gray-600">
                                Our platform is designed specifically for UTech students, with features and listings that cater to student needs.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <MapPin className="h-12 w-12 text-[#002f6c] mb-4" />
                            <h3 className="text-xl font-bold mb-2">Convenient Locations</h3>
                            <p className="text-gray-600">
                                Find properties in prime locations near the UTech campus, making your daily commute quick and easy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] text-center mb-12">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-[#002f6c] mx-auto mb-4 flex items-center justify-center">
                                <Heart className="h-16 w-16 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Dedicated Team</h3>
                            <p className="text-gray-600">
                                Our team is committed to providing the best housing experience for UTech students.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-[#002f6c] mx-auto mb-4 flex items-center justify-center">
                                <Building className="h-16 w-16 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                            <p className="text-gray-600">
                                We provide expert guidance and support throughout your housing search journey.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-[#002f6c] mx-auto mb-4 flex items-center justify-center">
                                <Users className="h-16 w-16 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Community Focus</h3>
                            <p className="text-gray-600">
                                Building a strong community of students and landlords for better housing solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 bg-[#002f6c] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Join UTechHousing Today</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Whether you're a student looking for housing or a landlord with properties to rent,
                        UTechHousing is here to help you find the perfect match.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <button className="bg-[#fdb813] hover:bg-[#fdb813]/90 text-[#002f6c] font-bold px-8 py-3 rounded-lg">
                                Sign Up as Student
                            </button>
                        </Link>
                        <Link href="/landlord/list-property">
                            <button className="bg-white hover:bg-gray-100 text-[#002f6c] font-bold px-8 py-3 rounded-lg">
                                List Your Property
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
} 