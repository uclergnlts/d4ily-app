import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { checkCronAuth } from '@/lib/cron-auth'
import webpush from 'web-push'

// Configure web-push with VAPID keys
// VAPID keys should be set in environment variables
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ''

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        'mailto:info@d4ily.com',
        vapidPublicKey,
        vapidPrivateKey
    )
}

export async function POST(request: Request) {
    // Check authentication
    const unauthorized = checkCronAuth(request)
    if (unauthorized) return unauthorized

    try {
        const { title, body, url } = await request.json()

        if (!title) {
            return NextResponse.json({ error: 'Title required' }, { status: 400 })
        }

        // Get all subscriptions from database
        const subscriptions = await db.all(sql`
      SELECT endpoint, keys_p256dh, keys_auth FROM push_subscriptions
    `) as any[]

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No subscriptions found',
                sent: 0
            })
        }

        const payload = JSON.stringify({
            title,
            body: body || 'Yeni bir gündem özeti hazır!',
            url: url || '/',
        })

        let successCount = 0
        let failCount = 0
        const failedEndpoints: string[] = []

        for (const sub of subscriptions) {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.keys_p256dh,
                            auth: sub.keys_auth,
                        },
                    },
                    payload
                )
                successCount++
            } catch (error: any) {
                failCount++
                // If subscription is no longer valid, mark for deletion
                if (error.statusCode === 410 || error.statusCode === 404) {
                    failedEndpoints.push(sub.endpoint)
                }
                console.error(`Failed to send to ${sub.endpoint}:`, error.message)
            }
        }

        // Clean up invalid subscriptions
        for (const endpoint of failedEndpoints) {
            await db.run(sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`)
        }

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            cleaned: failedEndpoints.length,
        })
    } catch (error: any) {
        console.error('Push send error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
