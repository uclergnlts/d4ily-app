import type { Metadata } from "next"
import { getLatestRawTweets } from "@/lib/digest-data"
import { Tweet } from "@/lib/digest-data"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { MessageSquare, Heart, Repeat2, ExternalLink, RefreshCw } from "lucide-react"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { LiveFeedInfoCard } from "@/components/live-feed-info-card"
import { AutoRefreshClient } from "@/components/auto-refresh-client"

import { InfiniteScrollClient } from "@/components/infinite-scroll-client"

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
    const tweets = await getLatestRawTweets(20)

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

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

                <LiveFeedInfoCard className="mb-6 lg:hidden" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8">
                        {/* Single Column Feed for Strict Chronological Order */}
                        <InfiniteScrollClient initialTweets={tweets} />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {/* Mini Info Card - Desktop Only */}
                            <LiveFeedInfoCard className="hidden lg:block" />

                            <TrendingHashtags />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
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
