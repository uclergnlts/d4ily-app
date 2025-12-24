import { NextResponse } from 'next/server';
import { getTrendingHashtags } from '@/lib/digest-data';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const hashtags = await getTrendingHashtags(24, 10);

        return NextResponse.json({
            success: true,
            hashtags,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error fetching trending hashtags:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
