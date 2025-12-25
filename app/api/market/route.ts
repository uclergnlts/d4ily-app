import { NextResponse } from 'next/server'
import { getMarketData } from '@/lib/services/market'

export const revalidate = 300 // 5 minutes

export async function GET() {
    try {
        const data = await getMarketData()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
    }
}
