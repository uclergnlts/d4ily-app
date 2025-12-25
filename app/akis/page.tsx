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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {/* Masonry Layout Container */}
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {tweets.length > 0 ? (
                                tweets.map((tweet) => (
                                    <div key={tweet.id + '-' + tweet.created_at} className="break-inside-avoid mb-6">
                                        <TweetCard tweet={tweet} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
                                    <p>Henüz akışa düşen tweet bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {/* Mini Info Card */}
                            <div className="rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-primary/10 p-6">
                                <h3 className="font-serif font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Canlı Yayın
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Şu anda takip edilen 60+ kişisel hesaptan (gazeteci, siyasetçi, uzman) gelen veriler anlık olarak akmaktadır.
                                </p>
                            </div>

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
        <div className="group relative bg-card/50 backdrop-blur-sm border border-border/60 hover:border-primary/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1">
            <div className="flex flex-col gap-3">
                {/* Header: Author & Time */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="shrink-0 relative">
                            {tweet.author_avatar ? (
                                <img src={tweet.author_avatar} alt={tweet.author_username} className="w-10 h-10 rounded-full object-cover ring-2 ring-background group-hover:ring-primary/20 transition-all" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-sm ring-2 ring-background">
                                    {tweet.author_name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {/* Verified Badge Mockup (We assume live feed accounts are mostly verified) */}
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                <div className="bg-blue-500 text-white rounded-full p-[2px]">
                                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.11-1.335.308C14.65 2.618 13.11 1.75 11.5 1.75c-2.485 0-4.5 2.02-4.5 4.508 0 .52.09 1.012.25 1.47-1.127.81-1.85 2.13-1.85 3.61 0 1.25.52 2.38 1.34 3.19-.504 1.1-.64 2.33-.356 3.51.523 2.17 2.476 3.71 4.776 3.71.21 0 .42-.01.623-.04.42 1.37 1.7 2.37 3.2 2.37 1.83 0 3.32-1.48 3.32-3.3 0-.007 0-.012-.002-.02.404.053.817.08 1.234.08 2.06 0 3.86-1.34 4.49-3.23.633.305 1.348.48 2.102.48 2.484 0 4.5-2.016 4.5-4.5 0-1.19-.46-2.27-1.2-3.07.13-.46.2-.95.2-1.45zM11.5 3.25c1.47 0 2.76.85 3.407 2.08-.184.026-.37.04-.557.04-2.83 0-5.18 1.95-5.83 4.67-.184.77-.282 1.57-.282 2.4 0 .43.028.85.077 1.27C6.63 13.06 5.51 11.55 5.2 9.77c-.52.2-1 .59-1.33 1.09.43 3.01 2.89 5.37 5.92 5.67.68.07 1.39.07 2.04.07 3.04.02 5.56-2.13 5.97-5.02.04-.31.06-.63.06-.95 0-1.02-.21-1.99-.59-2.87-.22-.52-.36-1.09-.36-1.68 0-1.57.85-2.95 2.16-3.77-.38-1.55-1.78-2.71-3.41-2.71-.24 0-.47.02-.7.07.03.35.04.7.04 1.06 0 2.21-1.79 4-4 4-.69 0-1.33-.17-1.9-.47-1.29-.68-2.3-1.89-2.76-3.32-.47-1.46.06-2.94 1.15-3.92z"></path></g></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-foreground truncate">{tweet.author_name}</span>
                            <span className="text-xs text-muted-foreground truncate">@{tweet.author_username}</span>
                        </div>
                    </div>

                    <span className="text-[10px] font-medium text-muted-foreground/70 bg-secondary/50 px-2 py-1 rounded-full whitespace-nowrap">
                        {timeAgo}
                    </span>
                </div>

                {/* Content */}
                <p className="text-foreground/90 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {tweet.content}
                </p>

                {/* Footer: Stats & Actions */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/30">
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/80">
                        <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-default">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{formatNumber(tweet.reply_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-default">
                            <Repeat2 className="h-3.5 w-3.5" />
                            <span>{formatNumber(tweet.retweet_count)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-default">
                            <Heart className="h-3.5 w-3.5" />
                            <span>{formatNumber(tweet.like_count)}</span>
                        </div>
                    </div>

                    <a
                        href={tweet.tweet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
                    >
                        X'te Gör
                        <ExternalLink className="h-3 w-3" />
                    </a>
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
    if (interval > 1) return Math.floor(interval) + " yıl"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " ay"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " gün"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " sa"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " dk"
    return "Şimdi"
}
