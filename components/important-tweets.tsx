import { Twitter, ExternalLink, Heart, MessageCircle, Repeat2 } from "lucide-react"
import Image from "next/image"
import type { Tweet } from "@/lib/digest-data"

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

function filterAndDeduplicateTweets(tweets: Tweet[], maxTweets = 5): Tweet[] {
  if (!tweets || tweets.length === 0) return []

  // Filter logic is handled by the server (getTopTweetsByDate)
  // We just trust the passed tweets are relevant for the specific day.
  const recentTweets = tweets;

  // Sort by total engagement
  const sortedTweets = [...recentTweets].sort((a, b) => {
    const engagementA = (a.like_count || 0) + (a.retweet_count || 0) + (a.reply_count || 0)
    const engagementB = (b.like_count || 0) + (b.retweet_count || 0) + (b.reply_count || 0)
    return engagementB - engagementA
  })

  if (sortedTweets.length <= maxTweets) {
    return sortedTweets
  }

  // Deduplicate similar topics - keep only most engaging tweet per topic
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

      if (uniqueTweets.length >= maxTweets) break
    }
  }

  if (uniqueTweets.length < maxTweets) {
    for (const tweet of sortedTweets) {
      if (!uniqueTweets.find((t) => t.id === tweet.id)) {
        uniqueTweets.push(tweet)
        if (uniqueTweets.length >= maxTweets) break
      }
    }
  }

  return uniqueTweets
}

export default function ImportantTweets({ tweets }: ImportantTweetsProps) {
  const filteredTweets = filterAndDeduplicateTweets(tweets, 5)

  if (!filteredTweets || filteredTweets.length === 0) {
    return null
  }

  return (
    <section className="py-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1DA1F2]/10 shadow-soft">
          <Twitter className="h-5 w-5 text-[#1DA1F2]" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Önemli Tweetler</h2>
          <p className="text-sm text-muted-foreground">Günün en çok etkileşim alan paylaşımları</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTweets.map((tweet) => (
          <div key={tweet.id} className="rounded-xl border border-border/60 bg-card p-5 shadow-soft card-interactive">
            <div className="flex gap-4">
              {tweet.author_avatar ? (
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full shadow-soft">
                  <Image
                    src={tweet.author_avatar || "/placeholder.svg"}
                    alt={tweet.author_name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5" title="Yanıt">
                      <MessageCircle className="h-4 w-4" />
                      <span>{formatNumber(tweet.reply_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600" title="Retweet">
                      <Repeat2 className="h-4 w-4" />
                      <span>{formatNumber(tweet.retweet_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-500" title="Beğeni">
                      <Heart className="h-4 w-4" />
                      <span>{formatNumber(tweet.like_count)}</span>
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
                      <span>Tweet'e Git</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-muted-foreground/70">Son 24 saatin en önemli tweet'leri</p>
      </div>
    </section>
  )
}
