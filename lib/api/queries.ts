import { desc, eq, and, lte, lt } from "drizzle-orm"
import { db } from "@/lib/db"
import { dailyDigests, processedArticles, topics, tweetsRaw } from "@/lib/db/schema"
import { getTodayInIstanbul, transformDigestResponse } from "@/lib/api-helpers"
import { getMarketData } from "@/lib/services/market"
import { getLatestArticles, getLatestNews } from "@/lib/services/news"

export async function getTodayOrLatestPublishedDigest() {
  const today = getTodayInIstanbul()

  const todaysDigest = await db
    .select()
    .from(dailyDigests)
    .where(and(eq(dailyDigests.digest_date, today), eq(dailyDigests.published, true)))
    .orderBy(desc(dailyDigests.created_at))
    .limit(1)

  if (todaysDigest.length > 0) {
    return transformDigestResponse(todaysDigest[0])
  }

  const fallbackDigest = await db
    .select()
    .from(dailyDigests)
    .where(and(lte(dailyDigests.digest_date, today), eq(dailyDigests.published, true)))
    .orderBy(desc(dailyDigests.digest_date))
    .limit(1)

  if (fallbackDigest.length === 0) {
    return null
  }

  return transformDigestResponse(fallbackDigest[0])
}

export async function getPublishedDigestByDate(date: string) {
  const digests = await db
    .select()
    .from(dailyDigests)
    .where(and(eq(dailyDigests.digest_date, date), eq(dailyDigests.published, true)))
    .orderBy(desc(dailyDigests.created_at))
    .limit(1)

  if (digests.length === 0) {
    return null
  }

  return transformDigestResponse(digests[0])
}

export async function getPublishedNewsFeed(limit: number) {
  return getLatestNews(limit)
}

export async function getPublishedEditorialFeed(limit: number) {
  return getLatestArticles(limit)
}

export async function getPublishedArticles(limit: number) {
  return db
    .select({
      id: processedArticles.id,
      title: processedArticles.title,
      summary: processedArticles.summary,
      imageUrl: processedArticles.image_url,
      sourceName: processedArticles.source_name,
      category: processedArticles.category,
      publishedAt: processedArticles.published_at,
      processedAt: processedArticles.processed_at,
    })
    .from(processedArticles)
    .where(eq(processedArticles.is_published, true))
    .orderBy(desc(processedArticles.processed_at))
    .limit(limit)
}

export async function getTopicList() {
  return db.select().from(topics).orderBy(desc(topics.created_at))
}

export async function getTweetFeed(limit: number, cursor: number | null) {
  const tweets = await db.query.tweetsRaw.findMany({
    limit,
    orderBy: [desc(tweetsRaw.id)],
    where: cursor ? lt(tweetsRaw.id, cursor) : undefined,
  })

  return {
    items: tweets,
    nextCursor: tweets.length > 0 ? tweets[tweets.length - 1].id : null,
    hasMore: tweets.length === limit,
  }
}

export async function getMarketSnapshot() {
  return getMarketData()
}
