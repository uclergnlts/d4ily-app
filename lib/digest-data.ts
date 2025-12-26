import { db } from "@/lib/db"
import { dailyDigests, tweetsRaw, weeklyDigests } from "@/lib/db/schema"
import { desc, eq, like, sql, gte, lte, and } from "drizzle-orm"

export interface Digest {
  id: number
  digest_date: string
  title: string
  intro: string
  content: string
  audio_url?: string
  audio_status?: string
  audio_duration?: number
  cover_image_url?: string
  greeting_text?: string
  spotify_url?: string
  created_at?: string
  updated_at?: string
  category?: string
}

export interface WeeklyDigest {
  id: number
  week_id: string
  year: number
  week_number: number
  start_date: string
  end_date: string
  title: string
  intro: string
  content: string
  highlights?: { category: string; items: string[] }[]
  trends?: string[]
  digests_count: number
  tweets_count: number
  news_count: number
  created_at?: string
  updated_at?: string
  cover_image_url?: string
}

export interface Tweet {
  id: number
  author_name: string
  author_username: string
  author_avatar?: string
  content: string
  like_count: number
  retweet_count: number
  reply_count: number
  created_at: string
  tweet_url?: string
}

export interface TrendingTopic {
  word: string
  count: number
  change: "up" | "down" | "stable"
}

export interface WeeklyStats {
  totalDigests: number
  totalTweets: number
  avgReadingTime: number
  topCategories: { name: string; count: number }[]
  dailyStats: { date: string; digestCount: number; tweetCount: number }[]
}

/**
 * ✅ IMPORTANT:
 * - Istanbul date (avoid UTC day shift)
 * - Short TTL cache (avoid “v0’da var prod’da yok”)
 * - Revalidate lowered
 */

export function getTodayDate(): string {
  const now = new Date()
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }))
  const y = ist.getFullYear()
  const m = String(ist.getMonth() + 1).padStart(2, "0")
  const d = String(ist.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getMockDigests(): Digest[] {
  const today = getTodayDate()
  return [
    {
      id: 1,
      digest_date: today,
      title: "Türkiye Gündemi - Bugünün Özeti",
      intro: "Günün önemli gelişmeleri",
      content:
        "Ekonomi cephesinde önemli gelişmeler yaşandı. Merkez Bankası faiz kararını açıkladı.\n\nSiyaset gündeminde ise Mecliste yoğun bir hafta geçirildi.\n\nSpor dünyasında Süper Ligde heyecan devam ediyor.",
      cover_image_url: "/images/daily-cover.jpg",
      greeting_text: "Günaydın! Bugünün özetine hoş geldiniz.",
    },
  ]
}

function getSupabaseStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null

  return `${supabaseUrl}/storage/v1/object/public/${path}`
}

/** ✅ light cache (1 minute) */
const digestCache = new Map<string, { data: Digest; timestamp: number }>()
const CACHE_TTL = 60_000 // 1 minute

export async function getLatestDigest(): Promise<Digest> {
  // (Optional) cache by "latest"
  const cacheKey = "digest_latest"
  const cached = digestCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data

  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(1)

    if (!data || data.length === 0) {
      const mock = getMockDigests()[0]
      digestCache.set(cacheKey, { data: mock, timestamp: Date.now() })
      return mock
    }

    const d0 = data[0] as unknown as Digest
    const digest: Digest = {
      ...d0,
      audio_url: getSupabaseStorageUrl(d0.audio_url) || undefined,
      cover_image_url: getSupabaseStorageUrl(d0.cover_image_url) || d0.cover_image_url,
    }

    digestCache.set(cacheKey, { data: digest, timestamp: Date.now() })
    return digest
  } catch (e) {
    const mock = getMockDigests()[0]
    digestCache.set(cacheKey, { data: mock, timestamp: Date.now() })
    return mock
  }
}

export async function getTodayDigest(): Promise<Digest> {
  // If you actually store "digest_date" daily and want strict:
  // return (await getDigestByDate(getTodayDate())) ?? (await getLatestDigest())
  return getLatestDigest()
}

export async function getDigestByDate(date: string): Promise<Digest | null> {
  const cacheKey = `digest_${date}`
  const cached = digestCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data

  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .where(eq(dailyDigests.digest_date, date))
      .limit(1)

    if (!data || data.length === 0) return null

    const d0 = data[0] as unknown as Digest
    const digest: Digest = {
      ...d0,
      audio_url: getSupabaseStorageUrl(d0.audio_url) || undefined,
      cover_image_url: getSupabaseStorageUrl(d0.cover_image_url) || d0.cover_image_url,
    }

    digestCache.set(cacheKey, { data: digest, timestamp: Date.now() })
    return digest
  } catch (e) {
    return null
  }
}

export async function getArchiveDigests(): Promise<Digest[]> {
  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(30)

    if (!data || data.length === 0) return getMockDigests()

    // ✅ transform urls in list too
    return (data as unknown as Digest[]).map((d) => ({
      ...d,
      audio_url: getSupabaseStorageUrl(d.audio_url) || undefined,
      cover_image_url: getSupabaseStorageUrl(d.cover_image_url) || d.cover_image_url,
    }))
  } catch (e) {
    return getMockDigests()
  }
}

export async function getDigestsByCategory(category: string, limit = 30): Promise<Digest[]> {
  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .where(eq(dailyDigests.category, category))
      .orderBy(desc(dailyDigests.digest_date))
      .limit(limit)

    if (!data || data.length === 0) return []

    return (data as unknown as Digest[]).map((d) => ({
      ...d,
      audio_url: getSupabaseStorageUrl(d.audio_url) || undefined,
      cover_image_url: getSupabaseStorageUrl(d.cover_image_url) || d.cover_image_url,
    }))
  } catch (e) {
    return []
  }
}

export async function getArchiveDigestsByMonth(year: string, month: string): Promise<Digest[]> {
  try {
    const startDate = `${year}-${month.padStart(2, "0")}-01`
    const endDate = `${year}-${month.padStart(2, "0")}-31`

    // Note: SQLite string comparison works for ISO dates
    const data = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
    // Logic for filtering can be done in DB or memory. 
    // Doing simple select all and filter in memory as original code did, 
    // or better yet, let's filter in DB if possible.
    // Drizzle doesn't have a simple 'between' for strings that works everywhere reliably 
    // without casting, but >= and <= work for ISO strings.

    // Original code fetched all and filtered. Let's do the same for consistency 
    // or improve it. Let's stick to original logic: select * ordered, then filter.
    // Wait, original code: select * order by date desc. then filter.

    if (!data || data.length === 0) return []

    return (data as unknown as Digest[])
      .filter((d: any) => d.digest_date >= startDate && d.digest_date <= endDate)
      .map((d) => ({
        ...d,
        audio_url: getSupabaseStorageUrl(d.audio_url) || undefined,
        cover_image_url: getSupabaseStorageUrl(d.cover_image_url) || d.cover_image_url,
      }))
  } catch (e) {
    return []
  }
}

export async function getDigestsByTopic(topic: string): Promise<Digest[]> {
  try {
    // Original: fetch 30, then filter.
    // We can use LIKE in SQL for better performance.
    const normalizedTopic = topic.toLowerCase()

    // NOTE: SQL 'LIKE' is case-insensitive in SQLite usually, checking...
    // To be safe/simple let's mimic original logic: fetch 30, filter JS.
    // Or fetch all? Original fetched limit 30.

    const data = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(30)

    if (!data || data.length === 0) return []

    return (data as unknown as Digest[])
      .filter((d: any) => {
        const content = (d.content || "").toLowerCase()
        const title = (d.title || "").toLowerCase()
        const intro = (d.intro || "").toLowerCase()
        return content.includes(normalizedTopic) || title.includes(normalizedTopic) || intro.includes(normalizedTopic)
      })
      .map((d) => ({
        ...d,
        audio_url: getSupabaseStorageUrl(d.audio_url) || undefined,
        cover_image_url: getSupabaseStorageUrl(d.cover_image_url) || d.cover_image_url,
      }))
  } catch (e) {
    return []
  }
}

export function formatDateTR(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function countWords(text: string): number {
  if (!text) return 0
  return text.split(" ").filter(Boolean).length
}

function transformTweet(rawTweet: any): Tweet {
  // raw_payload is already a JSON object in our Drizzle schema usage if we typed it,
  // but let's be careful. In schema it is `text(..., { mode: 'json' })`.
  // So `raw_payload` returned by Drizzle will be the object.
  let payload = rawTweet.raw_payload || {}

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      console.error("Failed to parse tweet payload", e);
      payload = {};
    }
  }

  const author = payload.author || {}

  return {
    id: rawTweet.id,
    author_name: author.name || author.userName || rawTweet.author_username || "Anonim",
    author_username: rawTweet.author_username || author.userName || "kullanici",
    author_avatar: author.profilePicture || author.avatar || author.profile_image_url || null,
    content: payload.text || rawTweet.text || "",
    like_count: rawTweet.like_count || payload.likeCount || 0,
    retweet_count: rawTweet.retweet_count || payload.retweetCount || 0,
    reply_count: rawTweet.reply_count || payload.replyCount || 0,
    created_at: rawTweet.published_at || rawTweet.created_at || "",
    tweet_url: payload.url || "",
  }
}

export async function getTopTweetsByDate(date: string, limit = 5): Promise<Tweet[]> {
  try {
    // 1. Fetch recent tweets (fetched in last 48h to be safe)
    // We cannot trust published_at format for SQL LIKE (it's "Fri Dec 19..." form from API)
    const data = await db
      .select()
      .from(tweetsRaw)
      .orderBy(desc(tweetsRaw.published_at))
      .limit(200) // Fetch enough to filter in memory

    if (!data || data.length === 0) return []

    // 2. Filter by "published_at" matching the target "date" (YYYY-MM-DD)
    let filtered = data.filter(t => {
      if (!t.published_at) return false;
      try {
        const d = new Date(t.published_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const tweetDateStr = `${y}-${m}-${day}`;
        return tweetDateStr === date;
      } catch (e) {
        return false;
      }
    });

    // Fallback: If no tweets found for the specific date, use the most recent ones
    // This ensures the section is never empty if we have data.
    if (filtered.length === 0) {
      filtered = data;
    }

    // 3. Sort by engagement
    const sorted = filtered.sort((a, b) => {
      const engagementA = (a.like_count || 0) + (a.retweet_count || 0) + (a.reply_count || 0)
      const engagementB = (b.like_count || 0) + (b.retweet_count || 0) + (b.reply_count || 0)
      return engagementB - engagementA
    });

    return sorted.slice(0, limit).map(transformTweet)
  } catch (e) {
    return []
  }
}

export async function getImportantTweets(limit = 20): Promise<Tweet[]> {
  // Fetch more tweets to filter from
  return getLatestTopTweets(limit)
}

export async function getLatestTopTweets(limit = 20): Promise<Tweet[]> {
  try {
    const data = await db
      .select()
      .from(tweetsRaw)
      .orderBy(desc(tweetsRaw.published_at))
      .limit(Math.min(limit * 2, 50))

    if (!data || data.length === 0) return []

    return data
      .map(transformTweet)
      .sort((a, b) => {
        const engagementA = (a.like_count || 0) + (a.retweet_count || 0) + (a.reply_count || 0)
        const engagementB = (b.like_count || 0) + (b.retweet_count || 0) + (b.reply_count || 0)
        return engagementB - engagementA
      })
      .slice(0, limit)
  } catch (e) {
    return []
  }
}

export async function getTrendingTopics(days = 7): Promise<TrendingTopic[]> {
  try {
    const data = await db
      .select({ content: dailyDigests.content })
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(days)

    if (!data || data.length === 0) return getDefaultTrendingTopics()

    const allContent = data.map((d: any) => d.content || "").join(" ")
    const wordCounts = countWordFrequency(allContent)
    return wordCounts.slice(0, 10)
  } catch (e) {
    return getDefaultTrendingTopics()
  }
}

function countWordFrequency(text: string): TrendingTopic[] {
  const stopWords = [
    "ve",
    "ile",
    "bir",
    "bu",
    "da",
    "de",
    "den",
    "dan",
    "icin",
    "ise",
    "gibi",
    "kadar",
    "daha",
    "en",
    "cok",
    "olan",
    "olarak",
    "sonra",
    "once",
    "ama",
    "ancak",
    "hem",
    "ya",
    "veya",
    "ki",
    "ne",
    "her",
    "hep",
    "tum",
    "bazi",
    "su",
    "o",
    "sen",
    "ben",
    "biz",
    "siz",
    "onlar",
    "kendi",
    "ayni",
    "baska",
    "hangi",
    "nasil",
    "neden",
    "nerede",
    "kim",
    "sey",
    "seyler",
    "yil",
    "gun",
    "ay",
    "hafta",
    "sayi",
    "oran",
    "artis",
    "dusus",
    "uzerinde",
    "altinda",
    "arasinda",
    "gore",
    "dolayi",
    "ragmen",
    "onemli",
    "buyuk",
    "kucuk",
    "yeni",
    "eski",
    "iyi",
    "kotu",
    "ilk",
    "son",
    "oldu",
    "olacak",
    "edildi",
    "yapildi",
    "geldi",
    "gitti",
    "aldi",
    "verdi",
    "soyledi",
    "dedi",
    "belirtti",
    "acikladi",
    "baskan",
    "baskani",
    "baskanligi",
    "bakan",
    "bakani",
    "bakanligi",
    "mudur",
    "muduru",
    "genel",
    "kurul",
    "kurulu",
    "uyesi",
    "uye",
    "yardimci",
    "yardimcisi",
    "sozcu",
    "sozcusu",
    "parti",
    "partisi",
    "ilce",
    "il",
    "bld",
    "belediye",
    "belediyesi",
    "yonetim",
    "yonelik",
    "hakkinda",
    "tarafindan",
    "uzere",
    "gore",
    "karsi",
    "onceki",
    "kendi",
    "bizim",
    "sizin",
    "onlarin",
  ]

  const words = text
    .toLowerCase()
    .split(/[\s.,;:!?()[\]{}'"/\\<>@#$%^&*+=|~`-]+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word) && !/^\d+$/.test(word) && !/^[a-z]{1,2}$/.test(word))

  const counts: Record<string, number> = {}
  for (const word of words) counts[word] = (counts[word] || 0) + 1

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  return sorted.map(([word, count], index) => ({
    word: word.charAt(0).toUpperCase() + word.slice(1),
    count,
    change: index < 3 ? "up" : index < 8 ? "stable" : "down",
  }))
}

function getDefaultTrendingTopics(): TrendingTopic[] {
  return [
    { word: "Ekonomi", count: 45, change: "up" },
    { word: "Enflasyon", count: 38, change: "up" },
    { word: "Merkez Bankasi", count: 32, change: "stable" },
    { word: "Secim", count: 28, change: "down" },
    { word: "Dolar", count: 25, change: "up" },
  ]
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  try {
    const digests = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(7)

    const tweets = await db
      .select()
      .from(tweetsRaw)
      .orderBy(desc(tweetsRaw.like_count))
      .limit(100)

    const digestList = digests || []
    const tweetList = tweets || []

    let totalWords = 0
    for (const d of digestList) totalWords += countWords(d.content || "")
    const avgReadingTime = digestList.length > 0 ? Math.ceil(totalWords / digestList.length / 200) : 5

    const categories = analyzeCategories(digestList)

    const dailyStats = digestList.map((d: any) => ({
      date: d.digest_date,
      digestCount: 1,
      tweetCount: Math.floor(Math.random() * 50) + 20,
    }))

    return {
      totalDigests: digestList.length,
      totalTweets: tweetList.length,
      avgReadingTime,
      topCategories: categories,
      dailyStats,
    }
  } catch (e) {
    return getDefaultWeeklyStats()
  }
}

function analyzeCategories(digests: any[]): { name: string; count: number }[] {
  const categoryKeywords: Record<string, string[]> = {
    Ekonomi: ["ekonomi", "enflasyon", "faiz", "dolar", "euro", "merkez bankasi", "borsa", "ihracat", "ithalat"],
    Siyaset: ["meclis", "hukumet", "bakan", "cumhurbaskani", "parti", "secim", "muhalefet", "iktidar"],
    Spor: ["futbol", "basketbol", "lig", "sampiyonlar", "mac", "takim", "galatasaray", "fenerbahce", "besiktas"],
    Teknoloji: ["yapay zeka", "teknoloji", "dijital", "internet", "uygulama", "siber", "yazilim"],
    Saglik: ["saglik", "hastane", "doktor", "ilac", "tedavi", "hastalik"],
    Egitim: ["egitim", "universite", "okul", "ogrenci", "sinav", "yks"],
  }

  const counts: Record<string, number> = {}
  const allContent = digests.map((d) => (d.content || "").toLowerCase()).join(" ")

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let count = 0
    for (const keyword of keywords) {
      const matches = allContent.split(keyword).length - 1
      count += matches
    }
    if (count > 0) counts[category] = count
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
}

function getDefaultWeeklyStats(): WeeklyStats {
  return {
    totalDigests: 7,
    totalTweets: 35,
    avgReadingTime: 5,
    topCategories: [
      { name: "Ekonomi", count: 45 },
      { name: "Siyaset", count: 32 },
      { name: "Spor", count: 28 },
      { name: "Teknoloji", count: 15 },
      { name: "Saglik", count: 12 },
    ],
    dailyStats: [],
  }
}

export async function getLatestDigestDate(): Promise<string> {
  try {
    const data = await db
      .select({ digest_date: dailyDigests.digest_date })
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(1)

    if (!data || data.length === 0) return getTodayDate()
    return data[0].digest_date
  } catch (e) {
    return getTodayDate()
  }
}

/**
 * ✅ Reduce global cache — don’t keep stale 404/old episodes for 1 hour
 */
export const revalidate = 60
/**
 * Fetch raw tweets for live feed
 * Only returns tweets from personal accounts (show_in_live_feed=true)
 */
export async function getLatestRawTweets(limit = 50, beforeId?: string): Promise<Tweet[]> {
  try {
    // Get live feed accounts
    // We use the hardcoded PERSONAL_ACCOUNTS list from config to ensure strict filtering
    // regardless of database state (which might have sync/caching issues).
    const { PERSONAL_ACCOUNTS } = await import('@/lib/config/sources');

    // Filter by live feed accounts (Strict Personal Accounts Only)
    // Case-insensitive check just in case
    const allowedUsernames = new Set(PERSONAL_ACCOUNTS.map(u => u.toLowerCase()));

    // Fetch raw data (fetched in last 12 hours)
    const rawData = await db
      .select()
      .from(tweetsRaw)
      .where(and(
        sql`${tweetsRaw.fetched_at} >= datetime('now', '-24 hours')`,
        beforeId ? lte(tweetsRaw.tweet_id, beforeId) : undefined
      ))
      .orderBy(desc(tweetsRaw.tweet_id)) // Sort by Snowflake ID (reliable chronological order)
      .limit(limit * 3) // Fetch more to allow for filtering

    let filtered = rawData;
    if (allowedUsernames.size > 0) {
      filtered = rawData.filter(tweet =>
        tweet.author_username && allowedUsernames.has(tweet.author_username.toLowerCase())
      );
    }

    // Map raw data to Tweet interface
    return filtered.slice(0, limit).map(raw => {
      // Safely parse JSON payload
      let payload: any = {};
      try {
        if (typeof raw.raw_payload === 'string') {
          payload = JSON.parse(raw.raw_payload);
        } else {
          payload = raw.raw_payload;
        }
      } catch (e) {
        payload = {};
      }

      // Extract text - Prioritize full text to avoid "..." truncation
      const text = payload.fullText || payload.full_text || payload.text || "No content";

      return {
        id: raw.id,
        author_name: payload.author?.name || raw.author_username || "Unknown",
        author_username: payload.author?.userName || raw.author_username || "unknown",
        author_avatar: payload.author?.profilePicture || undefined,

        content: text,
        like_count: payload.likeCount || raw.like_count || 0,
        retweet_count: payload.retweetCount || raw.retweet_count || 0,
        reply_count: payload.replyCount || raw.reply_count || 0,
        created_at: payload.createdAt || raw.published_at || new Date().toISOString(),
        tweet_url: `https://x.com/${payload.author?.userName || raw.author_username}/status/${raw.tweet_id}`
      };
    });
  } catch (e) {
    console.error("Error fetching raw tweets:", e)
    return []
  }
}

/**
 * Extract hashtags from tweet text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\wğüşıöçĞÜŞİÖÇ]+/gi;
  const matches = text.match(hashtagRegex) || [];
  return matches.map(tag => tag.toLowerCase());
}

/**
 * Get trending hashtags from recent tweets
 */
export async function getTrendingHashtags(hours = 24, limit = 10): Promise<{ tag: string; count: number }[]> {
  try {
    const rawData = await db
      .select()
      .from(tweetsRaw)
      .where(sql`${tweetsRaw.fetched_at} >= datetime('now', '-${sql.raw(hours.toString())} hours')`)
      .limit(500);

    // Extract all hashtags
    const hashtagCounts = new Map<string, number>();

    for (const tweet of rawData) {
      let payload: any = {};
      try {
        if (typeof tweet.raw_payload === 'string') {
          payload = JSON.parse(tweet.raw_payload);
        } else {
          payload = tweet.raw_payload;
        }
      } catch (e) {
        continue;
      }

      const text = payload.text || payload.fullText || '';
      const hashtags = extractHashtags(text);

      for (const tag of hashtags) {
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
      }
    }

    // Convert to array and sort by count
    const sorted = Array.from(hashtagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sorted;
  } catch (e) {
    console.error('Error fetching trending hashtags:', e);
    return [];
  }
}

// --- WEEKLY DIGEST FUNCTIONS ---

/** Get current week info */
export function getCurrentWeekInfo(): { weekId: string; year: number; weekNumber: number; startDate: string; endDate: string } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  // Get Monday of current week
  const dayOfWeek = now.getDay();
  const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  // Get Sunday 
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const weekId = `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;

  return {
    weekId,
    year: now.getFullYear(),
    weekNumber,
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
  };
}

export async function getLatestWeeklyDigest(): Promise<WeeklyDigest | null> {
  try {
    const data = await db
      .select()
      .from(weeklyDigests)
      .orderBy(desc(weeklyDigests.created_at))
      .limit(1);

    if (!data || data.length === 0) return null;

    return data[0] as unknown as WeeklyDigest;
  } catch (e) {
    console.error("Error fetching latest weekly digest:", e);
    return null;
  }
}

export async function getWeeklyDigestByWeekId(weekId: string): Promise<WeeklyDigest | null> {
  try {
    const data = await db
      .select()
      .from(weeklyDigests)
      .where(eq(weeklyDigests.week_id, weekId))
      .limit(1);

    if (!data || data.length === 0) return null;
    return data[0] as unknown as WeeklyDigest;
  } catch (e) {
    console.error(`Error fetching weekly digest ${weekId}:`, e);
    return null;
  }
}

export async function getWeeklyDigestsArchive(limit = 12): Promise<WeeklyDigest[]> {
  try {
    const data = await db
      .select()
      .from(weeklyDigests)
      .orderBy(desc(weeklyDigests.year), desc(weeklyDigests.week_number))
      .limit(limit);

    return (data || []) as unknown as WeeklyDigest[];
  } catch (e) {
    console.error("Error fetching weekly digests archive:", e);
    return [];
  }
}

export async function getDailyDigestsByDateRange(startDate: string, endDate: string): Promise<Digest[]> {
  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .where(
        and(
          gte(dailyDigests.digest_date, startDate),
          lte(dailyDigests.digest_date, endDate)
        )
      )
      .orderBy(dailyDigests.digest_date);

    return (data || []) as unknown as Digest[];
  } catch (e) {
    console.error(`Error fetching digests from ${startDate} to ${endDate}:`, e);
    return [];
  }
}
