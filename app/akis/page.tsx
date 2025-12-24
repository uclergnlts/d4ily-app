import type { Metadata } from "next"
import { getLatestRawTweets } from "@/lib/digest-data"
import { Tweet } from "@/lib/digest-data"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { MessageSquare, Heart, Repeat2, ExternalLink, RefreshCw } from "lucide-react"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { AutoRefreshClient } from "@/components/auto-refresh-client"

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = {
    title: "Canlı Akış - Anlık Tweet Güncellemeleri",
    description: "Türkiye gündeminden anlık gelişmeler. X (Twitter) üzerinden önemli hesapların en son paylaşımları.",
    openGraph: {
        title: "Canlı Akış - D4ily",
        description: "Türkiye gündeminden anlık gelişmeler. X (Twitter) üzerinden önemli hesapların en son paylaşımları.",
        url: "https://d4ily.com/akis",
    },
    alternates: {
        canonical: "https://d4ily.com/akis",
    },
}

export default async function LiveFeedPage() {
    const tweets = await getLatestRawTweets(60)

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navigation />

            <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Canlı Akış</h1>
                        <p className="text-muted-foreground">X (Twitter) üzerinden anlık olarak düşen önemli gelişmeler.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <AutoRefreshClient />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-4">
                        {tweets.length > 0 ? (
                            tweets.map((tweet) => (
                                <TweetCard key={tweet.id + '-' + tweet.created_at} tweet={tweet} />
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Henüz akışa düşen tweet bulunamadı.</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <TrendingHashtags />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
    const date = new Date(tweet.created_at)
    const timeAgo = getTimeAgo(date)

    return (
        <div className="bg-card border border-border/60 rounded-xl p-4 md:p-6 transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex gap-4">
                {/* Avatar Placeholder or Image */}
                <div className="shrink-0">
                    {tweet.author_avatar ? (
                        <img src={tweet.author_avatar} alt={tweet.author_username} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-border" />
                    ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {tweet.author_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-bold text-base md:text-lg truncate">{tweet.author_name}</span>
                            <span className="text-muted-foreground text-sm truncate">@{tweet.author_username}</span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
                    </div>

                    <p className="text-foreground/90 text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words mb-3">
                        {tweet.content}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4" />
                                <span>{formatNumber(tweet.reply_count)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Repeat2 className="h-4 w-4" />
                                <span>{formatNumber(tweet.retweet_count)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Heart className="h-4 w-4" />
                                <span>{formatNumber(tweet.like_count)}</span>
                            </div>
                        </div>

                        <a
                            href={tweet.tweet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Tweete Git
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " yıl önce"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " ay önce"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " gün önce"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " saat önce"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " dk önce"
    return "Az önce"
}
