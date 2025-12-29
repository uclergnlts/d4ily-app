import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function POST(request: Request) {
    try {
        const subscription = await request.json()

        if (!subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
        }

        // Store subscription in database
        // Note: You need to create a push_subscriptions table first
        await db.run(sql`
      INSERT OR REPLACE INTO push_subscriptions (endpoint, keys_p256dh, keys_auth, created_at)
      VALUES (
        ${subscription.endpoint},
        ${subscription.keys?.p256dh || ''},
        ${subscription.keys?.auth || ''},
        datetime('now')
      )
    `)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Push subscribe error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
