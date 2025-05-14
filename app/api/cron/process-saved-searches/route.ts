import { NextResponse } from 'next/server'
import { processSavedSearches } from '@/lib/email-notifications'

// export const runtime = 'edge'

export async function GET(request: Request) {
    try {
        // Verify the request is from a trusted source (e.g., Vercel Cron)
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        await processSavedSearches()
        return new NextResponse('Success', { status: 200 })
    } catch (error) {
        console.error('Error processing saved searches:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 