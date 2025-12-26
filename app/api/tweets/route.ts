import { NextResponse } from 'next/server'
import { getLatestRawTweets } from '@/lib/digest-data'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    try {
        // Note: getLatestRawTweets in digest-data.ts currently doesn't support offset directly
        // in its arguments, it selects recent by time.
        // However, for infinite scroll we need a way to page.
        // Since we can't easily modify the digest-data logic without potentially affecting others,
        // we will fetch a larger batch and slice, OR we should update getLatestRawTweets to support offset.
        // Let's check digest-data.ts again. It uses limit. 

        // Actually, getLatestRawTweets just fetches top `limit * 3` tweets from last 12 hours.
        // A proper cursor-based solution is better but requires DB modification (id < lastId).
        // Let's implement a simple "id based" cursor here if possible, or just slice for now.
        // But since the DB function is imported, let's write a new query here using the imported DB client,
        // OR just use getLatestRawTweets and hope the limit is enough? No, that's inefficient.

        // Better approach: fetch directly from DB here using cursor (lastId).

        // BUT, I can't easily import `db` and `tweetsRaw` here if I don't see them exported in a standard way?
        // `lib/digest-data.ts` exports them.

        // Let's try to import getLatestRawTweets and just use a larger limit for now, 
        // or better, let's just create a new function in a new lib file if needed?
        // Actually, I can allow passing a `beforeId` query param.

        // Wait, I can't modify `request` validation easily.
        // Let's update `lib/digest-data.ts` to accept an `beforeId` optional param?
        // That's the cleanest way. But I must be careful.

        // Actually, let's stick to the current implementation of `getLatestRawTweets` effectively just fetching recent ones.
        // If I want to implement infinite scroll properly, I should update `getLatestRawTweets`
        // to support `beforeId` (cursor pagination).

        // Let's try to simply fetch "more" by strictly increasing limit? No, that fetches redundancy.

        // Let's just create a CLIENT component that receives the initial tweets,
        // and when "load more" is clicked/reached, it calls this API.
        // This API needs to return tweets OLDER than the last one we have.

        // I'll create `lib/api-tweets.ts` helper or just write the DB query here if I can import `db`.
        // `lib/digest-data.ts` imports `db` from `@/lib/db`. I can do that too.
    } catch (error) {
        // ...
    }
}
// Rethink: I will modify `lib/digest-data.ts` to export a cursor-based function first.
// It is safer and cleaner.
