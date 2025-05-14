import Link from "next/link"
import { HelpCircle, Building, Users, CreditCard, MessageSquare, Shield } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-[#002f6c] text-white py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-lg md:text-xl mb-8 max-w-3xl">
                            Find answers to common questions about UTechHousing and our services.
                        </p>
                    </div>
                </section>

                {/* FAQ Categories */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <Building className="h-12 w-12 text-[#002f6c] mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">For Landlords</h3>
                                <p className="text-gray-600">
                                    Questions about listing and managing properties on our platform.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <Users className="h-12 w-12 text-[#002f6c] mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">For Students</h3>
                                <p className="text-gray-600">
                                    Information for students looking for housing near UTech.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                                <HelpCircle className="h-12 w-12 text-[#002f6c] mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">General Questions</h3>
                                <p className="text-gray-600">
                                    Common questions about our platform and services.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-12 md:py-16 bg-[#f5f7fa]">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] mb-8">For Landlords</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I list my property on UTechHousing?</AccordionTrigger>
                                    <AccordionContent>
                                        To list your property, click on the "List Your Property" button and complete the registration process.
                                        You'll need to provide property details, photos, and rental information. Our team will review your
                                        submission within 24 hours.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>What are the fees for listing a property?</AccordionTrigger>
                                    <AccordionContent>
                                        We charge a small commission fee only when a property is successfully rented through our platform.
                                        There are no upfront fees for listing your property.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How do I manage my property listings?</AccordionTrigger>
                                    <AccordionContent>
                                        Once your property is listed, you can manage it through your landlord dashboard. You can update
                                        information, respond to inquiries, and track viewings all in one place.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] mt-16 mb-8">For Students</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How do I find a property near UTech?</AccordionTrigger>
                                    <AccordionContent>
                                        You can browse available properties on our platform, use the search filters to narrow down your
                                        options, and contact landlords directly through our messaging system.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>Is there a fee for students to use the platform?</AccordionTrigger>
                                    <AccordionContent>
                                        No, our platform is completely free for students to use. You can browse properties, contact landlords,
                                        and schedule viewings at no cost.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger>How do I schedule a property viewing?</AccordionTrigger>
                                    <AccordionContent>
                                        Once you find a property you're interested in, you can contact the landlord directly through our
                                        messaging system to schedule a viewing. The landlord will coordinate the viewing time with you.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] mt-16 mb-8">General Questions</h2>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-7">
                                    <AccordionTrigger>How does UTechHousing verify properties?</AccordionTrigger>
                                    <AccordionContent>
                                        We verify all properties listed on our platform through a thorough screening process that includes
                                        property inspections, documentation verification, and landlord background checks.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-8">
                                    <AccordionTrigger>What safety measures are in place?</AccordionTrigger>
                                    <AccordionContent>
                                        We implement several safety measures including verified listings, secure messaging, and a review
                                        system. We also encourage users to report any suspicious activity.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-9">
                                    <AccordionTrigger>How can I contact support?</AccordionTrigger>
                                    <AccordionContent>
                                        You can reach our support team through email at support@utechhousing.com or by phone at +1 (876)
                                        123-4567. Our office hours are Monday to Friday, 9:00 AM to 5:00 PM.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#002f6c] mb-4">Still Have Questions?</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            If you can't find the answer you're looking for, our support team is here to help.
                        </p>
                        <Link href="/contact">
                            <button className="bg-[#002f6c] hover:bg-[#002f6c]/90 text-white font-bold px-8 py-3 rounded-lg">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
} 