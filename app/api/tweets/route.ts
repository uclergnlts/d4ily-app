import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tweetsRaw } from '@/lib/db/schema'
import { desc, lt } from 'drizzle-orm'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const beforeId = searchParams.get('beforeId')

    try {
        const tweets = await db.query.tweetsRaw.findMany({
            limit: limit,
            orderBy: [desc(tweetsRaw.id)],
            where: beforeId ? lt(tweetsRaw.id, parseInt(beforeId)) : undefined
        })

        return NextResponse.json({
            success: true,
            tweets: tweets,
            count: tweets.length,
            hasMore: tweets.length === limit,
            nextCursor: tweets.length > 0 ? tweets[tweets.length - 1].id : null
        })
    } catch (error) {
        console.error('Error fetching tweets:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tweets' },
            { status: 500 }
        )
    }
}
