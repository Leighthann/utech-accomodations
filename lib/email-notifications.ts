import { db } from '@/lib/firebase/config'
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    orderBy,
    limit
} from 'firebase/firestore'
import nodemailer from 'nodemailer'

interface Property {
    id: string
    title: string
    description: string
    price: number
    location: string
    propertyType: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    amenities: string[]
    createdAt: Timestamp
}

interface SavedSearch {
    id: string
    userId: string
    name: string
    filters: {
        propertyType?: string[]
        priceRange?: {
            min: number
            max: number
        }
        bedrooms?: number[]
        bathrooms?: number[]
        amenities?: string[]
        location?: string
        distance?: number
    }
    emailNotifications: boolean
    notificationFrequency: 'daily' | 'weekly' | 'instant'
    lastNotified?: Date
}

interface User {
    id: string
    email: string
    name: string
}

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export async function sendPropertyNotificationEmail(
    user: User,
    properties: Property[],
    searchName: string
) {
    const propertyList = properties
        .map(
            (property) => `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h3 style="margin: 0 0 10px 0; color: #002f6c;">${property.title}</h3>
                    <p style="margin: 0 0 10px 0; color: #4b5563;">${property.description}</p>
                    <div style="display: flex; gap: 20px; margin-bottom: 10px;">
                        <span style="color: #6b7280;">$${property.price}/mo</span>
                        <span style="color: #6b7280;">${property.bedrooms} beds</span>
                        <span style="color: #6b7280;">${property.bathrooms} baths</span>
                    </div>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}" 
                       style="display: inline-block; padding: 8px 16px; background-color: #002f6c; color: white; text-decoration: none; border-radius: 4px;">
                        View Property
                    </a>
                </div>
            `
        )
        .join('')

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: `New Properties Matching Your Search: ${searchName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #002f6c; margin-bottom: 20px;">New Properties Found</h2>
                <p style="color: #4b5563; margin-bottom: 20px;">
                    We found ${properties.length} new properties matching your saved search "${searchName}".
                </p>
                ${propertyList}
                <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">
                    You're receiving this email because you have saved search notifications enabled.
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/saved-searches" style="color: #002f6c;">
                        Manage your notification preferences
                    </a>
                </p>
            </div>
        `
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Error sending email:', error)
        throw error
    }
}

export async function processSavedSearches() {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get all active saved searches
    const savedSearchesRef = collection(db, 'savedSearches')
    const savedSearchesQuery = query(
        savedSearchesRef,
        where('emailNotifications', '==', true)
    )
    const savedSearchesSnapshot = await getDocs(savedSearchesQuery)

    for (const searchDoc of savedSearchesSnapshot.docs) {
        const search = searchDoc.data() as SavedSearch
        const searchId = searchDoc.id

        // Check if it's time to send notifications based on frequency
        const shouldNotify =
            search.notificationFrequency === 'instant' ||
            (search.notificationFrequency === 'daily' &&
                (!search.lastNotified ||
                    new Date(search.lastNotified) < oneDayAgo)) ||
            (search.notificationFrequency === 'weekly' &&
                (!search.lastNotified ||
                    new Date(search.lastNotified) < oneWeekAgo))

        if (!shouldNotify) continue

        // Get user details
        const userDoc = await db.collection('users').doc(search.userId).get()
        if (!userDoc.exists) continue
        const user = userDoc.data() as User

        // Build property query based on search filters
        let propertiesQuery = query(
            collection(db, 'properties'),
            orderBy('createdAt', 'desc'),
            limit(10)
        )

        if (search.filters.propertyType?.length) {
            propertiesQuery = query(
                propertiesQuery,
                where('propertyType', 'in', search.filters.propertyType)
            )
        }

        if (search.filters.priceRange) {
            propertiesQuery = query(
                propertiesQuery,
                where('price', '>=', search.filters.priceRange.min),
                where('price', '<=', search.filters.priceRange.max)
            )
        }

        if (search.filters.bedrooms?.length) {
            propertiesQuery = query(
                propertiesQuery,
                where('bedrooms', 'in', search.filters.bedrooms)
            )
        }

        if (search.filters.bathrooms?.length) {
            propertiesQuery = query(
                propertiesQuery,
                where('bathrooms', 'in', search.filters.bathrooms)
            )
        }

        // Get matching properties
        const propertiesSnapshot = await getDocs(propertiesQuery)
        const properties = propertiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Property[]

        if (properties.length > 0) {
            try {
                await sendPropertyNotificationEmail(user, properties, search.name)

                // Update last notified timestamp
                await db.collection('savedSearches').doc(searchId).update({
                    lastNotified: Timestamp.now()
                })
            } catch (error) {
                console.error(
                    `Error processing saved search ${searchId}:`,
                    error
                )
            }
        }
    }
} 