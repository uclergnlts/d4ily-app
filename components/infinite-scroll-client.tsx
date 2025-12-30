"use client"

import { useState, useEffect } from "react"
import type { Tweet } from "@/lib/digest-data"
import { TweetCard } from "@/components/tweet-card"
import { Loader2 } from "lucide-react"

interface InfiniteScrollClientProps {
    initialTweets: Tweet[]
}

export function InfiniteScrollClient({ initialTweets }: InfiniteScrollClientProps) {
    const [tweets, setTweets] = useState<Tweet[]>(initialTweets)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [cursor, setCursor] = useState<string | undefined>(
        initialTweets.length > 0 ? getTweetIdFromUrl(initialTweets[initialTweets.length - 1]) : undefined
    )

    // Sync state when initialTweets changes (after router.refresh())
    useEffect(() => {
        setTweets(initialTweets)
        setHasMore(true)
        setCursor(
            initialTweets.length > 0 ? getTweetIdFromUrl(initialTweets[initialTweets.length - 1]) : undefined
        )
    }, [initialTweets])

    function getTweetIdFromUrl(tweet: Tweet): string | undefined {
        // Need Snowflake ID for cursor. 
        // If we don't have it explicitly, we parse it from URL.
        // Drizzle raw tweets sort by ID, so last ID is smaller.
        // However our API needs `beforeId` which is the Snowflake ID.
        // Our `getLatestRawTweets` helper returns `Tweet` interface where `id` is the DB ID, not Snowflake ID.
        // But let's assume `tweet_url` has it.
        if (!tweet.tweet_url) return undefined
        const parts = tweet.tweet_url.split('/')
        return parts[parts.length - 1]
    }

    async function loadMore() {
        if (loading || !hasMore || !cursor) return

        setLoading(true)
        try {
            const res = await fetch(`/api/tweets?limit=20&beforeId=${cursor}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()

            if (data.tweets.length === 0) {
                setHasMore(false)
            } else {
                setTweets(prev => [...prev, ...data.tweets])
                // Update cursor
                setCursor(data.cursor)
                if (!data.hasMore) setHasMore(false)
            }
        } catch (error) {
            console.error("Error loading more tweets:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {tweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
            ))}

            {tweets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
                    <p>Henüz akışa düşen tweet bulunamadı.</p>
                </div>
            )}

            {hasMore && tweets.length > 0 && (
                <div className="flex justify-center pt-4 pb-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {loading ? "Yükleniyor..." : "Daha Fazla Göster"}
                    </button>
                </div>
            )}
        </div>
    )
}
