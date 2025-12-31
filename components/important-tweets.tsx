"use client"

import { Twitter, ExternalLink, Heart, MessageCircle, Repeat2, Filter } from "lucide-react"
import Image from "next/image"
import type { Tweet } from "@/lib/digest-data"
import { useState } from "react"

interface ImportantTweetsProps {
  tweets: Tweet[]
}

function formatNumber(num: number): string {
  if (!num) return "0"
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "B"
  }
  return String(num)
}

function filterAndDeduplicateTweets(tweets: Tweet[], maxTweets = 10, includeRetweets = true): Tweet[] {
  if (!tweets || tweets.length === 0) return []

  const recentTweets = tweets;

  // Initial Filter for Retweets if needed
  let candidates = recentTweets;
  if (!includeRetweets) {
    // Basic detection: usually "RT @username:"
    candidates = candidates.filter(t => !t.content.trim().startsWith("RT @"))
  }

  // Sort by total engagement
  const sortedTweets = [...candidates].sort((a, b) => {
    const engagementA = (a.like_count || 0) + (a.retweet_count || 0) + (a.reply_count || 0)
    const engagementB = (b.like_count || 0) + (b.retweet_count || 0) + (b.reply_count || 0)
    return engagementB - engagementA
  })

  // Deduplication Logic
  const uniqueTweets: Tweet[] = []
  const usedKeywords = new Set<string>()

  for (const tweet of sortedTweets) {
    const content = tweet.content.toLowerCase()

    const keywords = content
      .split(/[\s.,;:!?()[\]{}'"/\\<>@#$%^&*+=|~`-]+/)
      .filter((word) => word.length > 4)
      .slice(0, 3)

    const isDuplicate = keywords.some((keyword) => usedKeywords.has(keyword))

    if (!isDuplicate) {
      uniqueTweets.push(tweet)
      keywords.forEach((keyword) => usedKeywords.add(keyword))
    }

    // We collect more than max first, then slice, or break early
    if (uniqueTweets.length >= maxTweets) break
  }

  // If aggressive deduplication reduced too much, fill with top engaged remaining
  if (uniqueTweets.length < 5) { // Minimum 5 if possible
    for (const tweet of sortedTweets) {
      if (!uniqueTweets.find((t) => t.id === tweet.id)) {
        uniqueTweets.push(tweet)
        if (uniqueTweets.length >= maxTweets) break
      }
    }
  }

  return uniqueTweets.slice(0, maxTweets)
}

export default function ImportantTweets({ tweets }: ImportantTweetsProps) {
  const [filterMode, setFilterMode] = useState<"original" | "all">("original")

  const includeRetweets = filterMode === "all"
  const displayTweets = filterAndDeduplicateTweets(tweets, 5, includeRetweets)

  if (!tweets || tweets.length === 0) return null

  return (
    <section className="py-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1DA1F2]/10 shadow-soft">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Önemli Tweetler</h2>
            <p className="text-sm text-muted-foreground">Günün en çok etkileşim alan paylaşımları</p>
          </div>
        </div>

        {/* Filter Toggles */}
        <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
          <button
            onClick={() => setFilterMode("original")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterMode === "original"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Sadece Orijinal
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterMode === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
          >
            <Repeat2 className="h-3.5 w-3.5" />
            RT Dahil
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {displayTweets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border border-border/50">
            Bu filtreye uygun tweet bulunamadı.
          </div>
        ) : (
          displayTweets.map((tweet) => (
            <div key={tweet.id} className="rounded-xl border border-border/60 bg-card p-5 shadow-soft card-interactive">
              <div className="flex gap-4">
                {tweet.author_avatar ? (
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-soft">
                    <Image
                      src={tweet.author_avatar || "/placeholder.svg"}
                      alt={`${tweet.author_name} kullanıcısının profil fotoğrafı`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#1DA1F2]/20 to-[#1DA1F2]/40 flex items-center justify-center shadow-soft">
                    <span className="text-sm font-bold text-[#1DA1F2]">
                      {tweet.author_name ? tweet.author_name.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{tweet.author_name || "Anonim"}</span>
                    <span className="text-sm text-muted-foreground">@{tweet.author_username || "kullanici"}</span>
                  </div>

                  <p className="mb-4 font-serif text-lg leading-loose text-foreground/90">{tweet.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5" title="Yanıt">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{formatNumber(tweet.reply_count)} Yanıt</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-green-600" title="Retweet">
                        <Repeat2 className="h-3.5 w-3.5" />
                        <span>{formatNumber(tweet.retweet_count)} RT</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-500" title="Beğeni">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{formatNumber(tweet.like_count)} Beğeni</span>
                      </div>
                    </div>
                    {tweet.tweet_url && (
                      <a
                        href={tweet.tweet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-[#1DA1F2]/10 px-3 py-1.5 text-sm font-medium text-[#1DA1F2] transition-all hover:bg-[#1DA1F2] hover:text-white shadow-soft"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Tweet&apos;e Git</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-muted-foreground/70">Son 24 saatin en önemli tweet&apos;leri</p>
      </div>
    </section>
  )
}
