import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function POST(request: Request) {
    try {
        const { endpoint } = await request.json()

        if (!endpoint) {
            return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
        }

        // Remove subscription from database
        await db.run(sql`
      DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}
    `)

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Push unsubscribe error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
