import { desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { newsRaw, processedArticles, rssSources, trTweets, tweetsRaw, twitterAccounts } from "@/lib/db/schema"

type AgendaSignalType = "article" | "tweet"
type VerificationStatus = "confirmed" | "likelyConfirmed" | "unverified" | "conflicting"
type AgendaDetectionType =
  | "breaking_event"
  | "official_statement"
  | "political_statement"
  | "media_report"
  | "routine_activity"
  | "sports_update"
  | "market_update"
  | "noise"
  | "unknown"
type ConfidenceLevel = "low" | "medium" | "high"
type AgendaTier = "lead" | "major" | "watch" | "single_source" | "routine"
type StoryStatus = "confirmed" | "developing" | "needs_confirmation"
type SingleSourcePriority = "none" | "low" | "medium" | "high" | "critical"
type SourceCoverageLevel = "narrow" | "balanced" | "broad"

type AgendaSourceMeta = {
  trustScore: number
  isOfficial: boolean
  category: string | null
}

export type AgendaRelatedArticle = {
  id: number
  title: string
  summary: string
  sourceName: string | null
  category: string | null
  publishedAt: string | null
  processedAt: string
  url?: string | null
}

export type AgendaRelatedTweet = {
  id: number
  tweetId: string
  authorUsername: string | null
  authorDisplayName: string | null
  content: string
  publishedAt: string | null
  fetchedAt: string
  tweetUrl: string | null
  engagementScore: number
}

export type AgendaTopic = {
  id: string
  slug: string
  title: string
  summary: string
  whyItMatters: string
  category: string
  importanceScore: number
  agendaScore: number
  freshnessScore: number
  sourceDiversityScore: number
  publicImpactScore: number
  momentumScore: number
  sourceCoverageScore: number
  sourceCoverageLevel: SourceCoverageLevel
  agendaTier: AgendaTier
  storyStatus: StoryStatus
  singleSourcePriority: SingleSourcePriority
  singleSourceReason: string | null
  signalCount: number
  sourceCount: number
  officialSourceCount: number
  verificationStatus: VerificationStatus
  signalType: AgendaDetectionType
  confidenceLevel: ConfidenceLevel
  needsConfirmation: boolean
  isRoutine: boolean
  detectionReason: string
  newsCount: number
  tweetCount: number
  firstSeenAt: string | null
  lastUpdatedAt: string | null
  representativeSignals: Array<{
    type: AgendaSignalType
    title: string
    sourceName: string | null
    publishedAt: string | null
  }>
  newsFormat: {
    headline: string
    spot: string
    body: string
    latest: string
    context: string
    sourceLine: string
  }
  evidencePackage: {
    firstSeenAt: string | null
    lastUpdatedAt: string | null
    sourceCount: number
    officialSourceCount: number
    tweetCount: number
    newsCount: number
    sourceCoverageScore: number
    sourceCategories: string[]
    topTweets: AgendaRelatedTweet[]
    topArticles: AgendaRelatedArticle[]
  }
  keywords: string[]
}

export type AgendaTopicDetail = AgendaTopic & {
  verificationReason: string
  watchNext: string
  relatedArticles: AgendaRelatedArticle[]
  relatedTweets: AgendaRelatedTweet[]
  keywords: string[]
}

type ArticleSignal = AgendaRelatedArticle & {
  type: "article"
  normalizedText: string
  tokens: string[]
  titleTokens: string[]
}

type TweetSignal = AgendaRelatedTweet & {
  type: "tweet"
  normalizedText: string
  tokens: string[]
  titleTokens: string[]
}

type AgendaSignal = ArticleSignal | TweetSignal

type RawTweetRow = typeof tweetsRaw.$inferSelect

type AgendaCluster = {
  id: string
  slug: string
  title: string
  summary: string
  category: string
  keywords: string[]
  keywordSet: Set<string>
  titleKeywordSet: Set<string>
  relatedArticles: AgendaRelatedArticle[]
  relatedTweets: AgendaRelatedTweet[]
  sourceNames: Set<string>
  sourceCategories: Set<string>
  highTrustSourceNames: Set<string>
  officialSourceNames: Set<string>
  firstSeenAt: string | null
  lastUpdatedAt: string | null
  totalEngagement: number
  representativeSignals: AgendaTopic["representativeSignals"]
}

const TURKISH_STOPWORDS = new Set([
  "acaba",
  "ama",
  "ancak",
  "artık",
  "aslında",
  "az",
  "bazı",
  "belki",
  "ben",
  "bile",
  "bir",
  "biraz",
  "biri",
  "birkaç",
  "birşey",
  "biz",
  "bu",
  "buna",
  "bunda",
  "bundan",
  "bunlar",
  "bunları",
  "bunların",
  "bunu",
  "bunun",
  "burada",
  "bütün",
  "çok",
  "çünkü",
  "da",
  "daha",
  "de",
  "defa",
  "diye",
  "dolayı",
  "en",
  "gibi",
  "göre",
  "hala",
  "hangi",
  "hatta",
  "hem",
  "hep",
  "hepsi",
  "her",
  "hiç",
  "için",
  "ile",
  "ise",
  "işte",
  "kadar",
  "karşın",
  "kendi",
  "kez",
  "ki",
  "kim",
  "kimse",
  "mı",
  "mi",
  "mu",
  "mü",
  "nasıl",
  "ne",
  "neden",
  "nerde",
  "nerede",
  "nereye",
  "niçin",
  "niye",
  "o",
  "olan",
  "olarak",
  "oldu",
  "olduğu",
  "olmak",
  "olsa",
  "olsun",
  "onu",
  "onun",
  "orada",
  "oysa",
  "pek",
  "rağmen",
  "sanki",
  "şey",
  "siz",
  "şu",
  "tüm",
  "ve",
  "veya",
  "ya",
  "yani",
  "yerine",
  "yine",
  "yok",
  "zaten",
])

const SIGNAL_WINDOW_MS = 24 * 60 * 60 * 1000
const RAW_NEWS_SOURCE_LIMIT = 35
const TWEET_SOURCE_LIMIT = 25

const GENERIC_CLUSTER_TOKENS = new Set([
  "abd",
  "aciklama",
  "açıklama",
  "bas",
  "baskan",
  "başkan",
  "başkani",
  "başkanı",
  "başkanımız",
  "basladi",
  "başladı",
  "baslatildi",
  "başlatıldı",
  "belediye",
  "belediyesi",
  "beyaz",
  "dair",
  "dava",
  "davası",
  "davasında",
  "davasinda",
  "davasında",
  "degerlendirme",
  "değerlendirme",
  "dedi",
  "dayanışma",
  "dayanisma",
  "gundem",
  "gündem",
  "gün",
  "günü",
  "gun",
  "gunu",
  "günün",
  "gunun",
  "genel",
  "hakkinda",
  "hakkında",
  "http",
  "https",
  "iran",
  "karar",
  "karari",
  "kararı",
  "kanı",
  "kanımız",
  "kutlama",
  "kutlamaları",
  "kutlamalari",
  "kutlu",
  "mayıs",
  "mayis",
  "emek",
  "emekçi",
  "emekçiler",
  "emekciler",
  "işçi",
  "işçiler",
  "isci",
  "isciler",
  "rt",
  "son",
  "sonra",
  "saray",
  "sayın",
  "sorusturma",
  "soruşturma",
  "tbmm",
  "toplantı",
  "toplantımızı",
  "talep",
  "talebi",
  "teşkilatımız",
  "teskilatımız",
  "trump",
  "tco",
  "yeni",
  "yaşasın1mayıs",
  "yasasin1mayis",
  "yapılan",
  "yapilan",
  "ziyaret",
  "ziyareti",
  "ziyaretimizin",
])

const BREAKING_EVENT_TOKENS = new Set([
  "afet",
  "atama",
  "baskın",
  "bomba",
  "çarpışma",
  "çöktü",
  "dava",
  "deprem",
  "duman",
  "erteleme",
  "gözaltı",
  "gözaltına",
  "hapis",
  "idari",
  "ihale",
  "ihlal",
  "iptal",
  "istifa",
  "kapatıldı",
  "karar",
  "kaza",
  "kayboldu",
  "mahkeme",
  "müdahale",
  "operasyon",
  "patlama",
  "saldırı",
  "sel",
  "son",
  "soruşturma",
  "tahliye",
  "tahliyeler",
  "tahliyesi",
  "tutuklama",
  "tutuklandı",
  "yangın",
  "yaralı",
  "yasak",
  "ölü",
  "şehit",
])

const OFFICIAL_STATEMENT_TOKENS = new Set([
  "açıklama",
  "açıklandı",
  "basın",
  "bildirdi",
  "duyurdu",
  "duyuru",
  "genelge",
  "karar",
  "resmi",
  "tebliğ",
  "yayımlandı",
])

const POLITICAL_TOKENS = new Set([
  "aday",
  "akp",
  "bakan",
  "belediye",
  "büyükşehir",
  "chp",
  "cumhurbaşkanı",
  "dem",
  "genel",
  "hükümet",
  "ibb",
  "iktidar",
  "meclis",
  "mhpli",
  "mhp",
  "parti",
  "siyaset",
  "tbmm",
])

const ROUTINE_ACTIVITY_TOKENS = new Set([
  "ağırladık",
  "başarılar",
  "buluşma",
  "görüşme",
  "katıldı",
  "katıldık",
  "kutlama",
  "kutluyorum",
  "program",
  "tebrik",
  "teşekkür",
  "toplantı",
  "ziyaret",
])

const SPORTS_TOKENS = new Set([
  "basketbol",
  "derbi",
  "fenerbahçe",
  "futbol",
  "galatasaray",
  "gol",
  "maç",
  "spor",
  "süper",
  "trabzonspor",
  "transfer",
])

const MARKET_TOKENS = new Set([
  "borsa",
  "dolar",
  "ekonomi",
  "enflasyon",
  "euro",
  "faiz",
  "gram",
  "piyasa",
  "tcmb",
])

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 3 && !TURKISH_STOPWORDS.has(token))
    .slice(0, 16)
}

function getClusterTitleTokens(value: string) {
  return tokenize(value).filter((token) => token.length >= 4 && !GENERIC_CLUSTER_TOKENS.has(token))
}

function getClusterBodyTokens(value: string) {
  return tokenize(value).filter((token) => token.length >= 4 && !GENERIC_CLUSTER_TOKENS.has(token))
}

function buildSlug(value: string) {
  const normalized = value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return normalized || "gundem"
}

function sourceKey(value: string | null) {
  return value?.replace(/^@/, "").toLocaleLowerCase("tr-TR").trim() ?? ""
}

function parseSignalDate(value: string | null) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function normalizeSignalDate(value: string | null) {
  return parseSignalDate(value)?.toISOString() ?? value
}

function isRecentSignal(...values: Array<string | null>) {
  const cutoff = Date.now() - SIGNAL_WINDOW_MS

  return values.some((value) => {
    const parsed = parseSignalDate(value)
    return parsed ? parsed.getTime() >= cutoff : false
  })
}

function isRecentlyPublished(publishedAt: string | null, fallbackAt: string | null) {
  if (publishedAt) {
    return isRecentSignal(publishedAt)
  }

  return isRecentSignal(fallbackAt)
}

function getOverlapScore(left: string[], right: Set<string>) {
  if (left.length === 0 || right.size === 0) {
    return 0
  }

  let matches = 0
  for (const token of left) {
    if (right.has(token)) {
      matches += 1
    }
  }

  return matches / Math.max(left.length, right.size)
}

function getMatchCount(left: string[], right: Set<string>) {
  let matches = 0
  for (const token of left) {
    if (right.has(token)) {
      matches += 1
    }
  }
  return matches
}

function getTitleMatchQuality(left: string[], right: Set<string>) {
  if (left.length === 0 || right.size === 0) {
    return { matches: 0, ratio: 0 }
  }

  const matches = getMatchCount(left, right)
  return {
    matches,
    ratio: matches / Math.min(left.length, right.size),
  }
}

function hasStrongTitleMatch(left: string[], right: Set<string>) {
  const quality = getTitleMatchQuality(left, right)

  if (left.length <= 2 || right.size <= 2) {
    return quality.matches >= Math.min(left.length, right.size)
  }

  return quality.matches >= 2 && quality.ratio >= 0.5
}

function getSourceBalancedRows<T extends { sourceName: string | null }>(rows: T[], limitPerSource: number) {
  const counts = new Map<string, number>()

  return rows.filter((row) => {
    const key = sourceKey(row.sourceName) || "unknown"
    const count = counts.get(key) ?? 0
    if (count >= limitPerSource) {
      return false
    }

    counts.set(key, count + 1)
    return true
  })
}

function getAuthorBalancedRows<T extends { author_username: string | null }>(rows: T[], limitPerAuthor: number) {
  const counts = new Map<string, number>()

  return rows.filter((row) => {
    const key = sourceKey(row.author_username) || "unknown"
    const count = counts.get(key) ?? 0
    if (count >= limitPerAuthor) {
      return false
    }

    counts.set(key, count + 1)
    return true
  })
}

function cleanTweetText(value: string) {
  return value
    .replace(/^RT\s+@[\w_]+:\s*/i, "")
    .replace(/@\w+/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function buildReadableText(value: string, maxLength: number) {
  const cleaned = cleanTweetText(value)
  if (cleaned.length <= maxLength) {
    return cleaned
  }

  const sentenceEnd = cleaned.search(/[.!?]\s/)
  if (sentenceEnd > 30 && sentenceEnd <= maxLength) {
    return cleaned.slice(0, sentenceEnd + 1)
  }

  return `${cleaned.slice(0, maxLength).trim()}...`
}

function extractTweetText(payload: any) {
  return (
    payload?.fullText ??
    payload?.text ??
    payload?.legacy?.full_text ??
    payload?.legacy?.text ??
    payload?.note_tweet?.note_tweet_results?.result?.text ??
    ""
  )
}

function extractTweetDisplayName(payload: any) {
  return (
    payload?.author?.name ??
    payload?.user?.name ??
    payload?.core?.user_results?.result?.legacy?.name ??
    null
  )
}

function epochSecondsToIso(value: number | null) {
  if (!value) {
    return null
  }

  return new Date(value * 1000).toISOString()
}

async function getRecentTweetRows(): Promise<RawTweetRow[]> {
  try {
    return await db.query.tweetsRaw.findMany({
      limit: 5000,
      orderBy: [desc(tweetsRaw.id)],
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes("tweets_raw")) {
      throw error
    }
  }

  const rows = await db
    .select()
    .from(trTweets)
    .orderBy(desc(trTweets.tweeted_at))
    .limit(5000)

  return rows.map((row, index) => ({
    id: index + 1,
    tweet_id: row.id,
    source: "tr_tweets",
    published_at: epochSecondsToIso(row.tweeted_at),
    fetched_at: epochSecondsToIso(row.fetched_at) ?? new Date().toISOString(),
    lang: row.lang,
    author_username: row.user_name,
    retweet_count: row.retweet_count,
    reply_count: row.reply_count,
    like_count: row.like_count,
    quote_count: 0,
    view_count: row.view_count,
    bookmark_count: 0,
    raw_payload: {
      text: row.text ?? "",
      author: {
        name: row.display_name,
      },
    },
  }))
}

function buildTweetUrl(tweetId: string, authorUsername: string | null) {
  if (!tweetId || !authorUsername) {
    return null
  }

  return `https://x.com/${authorUsername}/status/${tweetId}`
}

function getTweetEngagementScore(tweet: {
  like_count: number | null
  retweet_count: number | null
  reply_count: number | null
  quote_count: number | null
  view_count: number | null
  bookmark_count: number | null
}) {
  const likes = tweet.like_count ?? 0
  const retweets = tweet.retweet_count ?? 0
  const replies = tweet.reply_count ?? 0
  const quotes = tweet.quote_count ?? 0
  const views = tweet.view_count ?? 0
  const bookmarks = tweet.bookmark_count ?? 0

  return likes + retweets * 2 + replies * 2 + quotes * 3 + bookmarks * 2 + Math.round(views / 500)
}

function buildWhyItMatters(topic: AgendaCluster) {
  const parts = [
    `${topic.relatedArticles.length} haber`,
    `${topic.relatedTweets.length} sosyal sinyal`,
    `${topic.sourceNames.size} farklı kaynak`,
  ]

  return `Konu ${parts.join(", ")} ile destekleniyor ve son akışta tekrar eden güçlü bir gündem başlığı olarak öne çıkıyor.`
}

function getVerification(cluster: AgendaCluster) {
  if (cluster.officialSourceNames.size > 0) {
    return {
      status: "confirmed" as const,
      reason: `${cluster.officialSourceNames.size} resmi veya birincil kaynak sinyali bulundu.`,
    }
  }

  if (cluster.highTrustSourceNames.size >= 2) {
    return {
      status: "likelyConfirmed" as const,
      reason: `${cluster.highTrustSourceNames.size} yüksek güvenilir bağımsız kaynak aynı gündemi destekliyor.`,
    }
  }

  if (cluster.sourceNames.size >= 2 && cluster.relatedArticles.length > 0) {
    return {
      status: "likelyConfirmed" as const,
      reason: "Birden fazla kaynakta haber sinyali var; resmi teyit henüz görünmüyor.",
    }
  }

  return {
    status: "unverified" as const,
    reason: "Konu sınırlı sayıda kaynakla veya ağırlıkla sosyal sinyallerle destekleniyor.",
  }
}

function buildWatchNext(cluster: AgendaCluster, status: VerificationStatus) {
  if (status === "confirmed") {
    return "Resmi açıklamanın ardından ek kurum açıklamaları, uygulama detayları ve yeni kaynak sinyalleri izlenmeli."
  }

  if (status === "likelyConfirmed") {
    return "Resmi teyit, birincil belge veya doğrudan ilgili kurum açıklaması beklenmeli."
  }

  return "Konu güçlenirse bağımsız ikinci kaynaklar ve resmi açıklama yüzeyleri kontrol edilmeli."
}

function buildSummary(topic: AgendaCluster) {
  const firstArticle = topic.relatedArticles[0]
  if (firstArticle?.summary) {
    return firstArticle.summary
  }

  const firstTweet = topic.relatedTweets[0]
  if (firstTweet?.content) {
    return buildReadableText(firstTweet.content, 220)
  }

  return `${topic.title} etrafında toplanan sinyaller öne çıkıyor.`
}

function chooseTitle(cluster: AgendaCluster) {
  if (cluster.relatedArticles.length > 0) {
    return cluster.relatedArticles[0].title
  }

  if (cluster.relatedTweets.length > 0) {
    const sortedTweets = [...cluster.relatedTweets].sort((left, right) => right.engagementScore - left.engagementScore)
    return buildReadableText(sortedTweets[0].content, 100)
  }

  return "Gündem başlığı"
}

function updateTimestamps(cluster: AgendaCluster, timestamp: string | null) {
  if (!timestamp) {
    return
  }

  if (!cluster.firstSeenAt || timestamp < cluster.firstSeenAt) {
    cluster.firstSeenAt = timestamp
  }

  if (!cluster.lastUpdatedAt || timestamp > cluster.lastUpdatedAt) {
    cluster.lastUpdatedAt = timestamp
  }
}

function buildRepresentativeSignal(signal: AgendaSignal) {
  return {
    type: signal.type,
    title: signal.type === "article" ? signal.title : buildReadableText(signal.content, 120),
    sourceName: signal.type === "article" ? signal.sourceName : signal.authorUsername,
    publishedAt: signal.type === "article" ? signal.publishedAt : signal.publishedAt,
  }
}

function scoreCluster(cluster: AgendaCluster) {
  const newsWeight = cluster.relatedArticles.length * 18
  const tweetWeight = cluster.relatedTweets.length * 10
  const sourceWeight = Math.min(cluster.sourceNames.size, 8) * 7
  const engagementWeight = Math.min(Math.round(cluster.totalEngagement / 25), 35)
  return newsWeight + tweetWeight + sourceWeight + engagementWeight
}

function getHoursSince(value: string | null) {
  const parsed = parseSignalDate(value)
  if (!parsed) return 24

  return Math.max(0, (Date.now() - parsed.getTime()) / (60 * 60 * 1000))
}

function getFreshnessScore(cluster: AgendaCluster) {
  const hoursSinceUpdate = getHoursSince(cluster.lastUpdatedAt)
  if (hoursSinceUpdate <= 1) return 100
  if (hoursSinceUpdate <= 3) return 85
  if (hoursSinceUpdate <= 6) return 70
  if (hoursSinceUpdate <= 12) return 50
  return 25
}

function getSourceDiversityScore(cluster: AgendaCluster) {
  const sourceScore = Math.min(cluster.sourceNames.size * 12, 60)
  const categoryScore = Math.min(cluster.sourceCategories.size * 8, 24)
  const officialScore = cluster.officialSourceNames.size > 0 ? 16 : 0
  return Math.min(100, sourceScore + categoryScore + officialScore)
}

function getSourceCoverageLevel(score: number): SourceCoverageLevel {
  if (score >= 72) return "broad"
  if (score >= 42) return "balanced"
  return "narrow"
}

function getSourceCoverageScore(cluster: AgendaCluster) {
  const sourceScore = Math.min(cluster.sourceNames.size * 18, 54)
  const categoryScore = Math.min(cluster.sourceCategories.size * 12, 24)
  const officialScore = Math.min(cluster.officialSourceNames.size * 10, 12)
  const highTrustScore = Math.min(cluster.highTrustSourceNames.size * 5, 10)

  return Math.min(100, sourceScore + categoryScore + officialScore + highTrustScore)
}

function getPublicImpactScore(cluster: AgendaCluster, signalType: AgendaDetectionType, isRoutine: boolean) {
  if (isRoutine) return 20

  const typeScore: Record<AgendaDetectionType, number> = {
    breaking_event: 90,
    official_statement: 75,
    political_statement: 70,
    market_update: 68,
    media_report: 55,
    sports_update: 45,
    routine_activity: 20,
    noise: 5,
    unknown: 35,
  }
  const categoryBoost = hasCategory(
    cluster,
    "resmi_kurum",
    "valilik",
    "bakan",
    "parti_ve_meclis",
    "milletvekili",
    "stk_meslek_sendika",
    "hak_orgutu",
    "emek_stk",
    "ekonomi_finans",
    "dis_politika",
  ) ? 10 : 0

  return Math.min(100, (typeScore[signalType] ?? 35) + categoryBoost)
}

function getMomentumScore(cluster: AgendaCluster) {
  const recentCutoff = Date.now() - 3 * 60 * 60 * 1000
  const recentSignals = [
    ...cluster.relatedArticles.map((article) => article.publishedAt ?? article.processedAt),
    ...cluster.relatedTweets.map((tweet) => tweet.publishedAt ?? tweet.fetchedAt),
  ].filter((value) => {
    const parsed = parseSignalDate(value)
    return parsed ? parsed.getTime() >= recentCutoff : false
  }).length

  const recentRatio = recentSignals / Math.max(cluster.relatedArticles.length + cluster.relatedTweets.length, 1)
  const volumeScore = Math.min(recentSignals * 18, 70)
  const ratioScore = Math.round(recentRatio * 30)

  return Math.min(100, volumeScore + ratioScore)
}

function getAgendaScore(scores: {
  importanceScore: number
  freshnessScore: number
  sourceDiversityScore: number
  publicImpactScore: number
  momentumScore: number
  confidenceLevel: ConfidenceLevel
  needsConfirmation: boolean
  isRoutine: boolean
}) {
  const confidenceBoost = scores.confidenceLevel === "high" ? 12 : scores.confidenceLevel === "medium" ? 6 : 0
  const confirmationPenalty = scores.needsConfirmation ? 12 : 0
  const routinePenalty = scores.isRoutine ? 18 : 0

  return Math.max(0, Math.min(100, Math.round(
    Math.min(scores.importanceScore, 120) * 0.18 +
    scores.freshnessScore * 0.20 +
    scores.sourceDiversityScore * 0.22 +
    scores.publicImpactScore * 0.24 +
    scores.momentumScore * 0.16 +
    confidenceBoost -
    confirmationPenalty -
    routinePenalty,
  )))
}

function getStoryStatus(confidenceLevel: ConfidenceLevel, needsConfirmation: boolean): StoryStatus {
  if (needsConfirmation || confidenceLevel === "low") return "needs_confirmation"
  if (confidenceLevel === "high") return "confirmed"
  return "developing"
}

function hasSoftSingleSourceLanguage(cluster: AgendaCluster) {
  const text = normalizeText([
    cluster.title,
    cluster.summary,
    ...cluster.relatedTweets.slice(0, 2).map((tweet) => tweet.content),
  ].join(" "))

  return [
    "günün fotoğrafı",
    "gününfotoğrafı",
    "anadolu nun en",
    "minik bir yürekte",
    "tebrik ediyorum",
    "kutluyorum",
    "başarılar diliyorum",
    "ziyaret ettik",
    "ağırladık",
    "bir araya geldik",
  ].some((phrase) => text.includes(phrase))
}

function getSingleSourcePriority(cluster: AgendaCluster, scores: {
  signalCount: number
  signalType: AgendaDetectionType
  freshnessScore: number
  publicImpactScore: number
  momentumScore: number
  needsConfirmation: boolean
  isRoutine: boolean
}) {
  const isSingleSource = scores.signalCount === 1 || scores.needsConfirmation
  if (!isSingleSource) {
    return {
      priority: "none" as const,
      reason: null,
    }
  }

  if (scores.isRoutine) {
    return {
      priority: "low" as const,
      reason: "Tek kaynaklı rutin faaliyet; kaybolmasın diye izleme listesinde tutuluyor.",
    }
  }

  if (scores.signalCount === 1 && hasSoftSingleSourceLanguage(cluster)) {
    return {
      priority: "low" as const,
      reason: "Tek kaynaklı ve rutin/soft içerik dili taşıyor; yine de izleme listesinde tutuluyor.",
    }
  }

  let score = 0
  const reasons: string[] = []

  if (cluster.officialSourceNames.size > 0) {
    score += 30
    reasons.push("resmi/birincil kaynaktan geldi")
  } else if (cluster.highTrustSourceNames.size > 0) {
    score += 24
    reasons.push("yüksek güvenilir kaynak sinyali")
  }

  if (scores.signalType === "breaking_event") {
    score += 26
    reasons.push("olay/son dakika dili taşıyor")
  } else if (scores.signalType === "official_statement" || scores.signalType === "political_statement") {
    score += 18
    reasons.push("kamu gündemiyle ilişkili")
  } else if (scores.signalType === "market_update") {
    score += 16
    reasons.push("ekonomi/piyasa etkisi olabilir")
  }

  if (scores.publicImpactScore >= 80) {
    score += 18
    reasons.push("kamu etkisi yüksek")
  } else if (scores.publicImpactScore >= 60) {
    score += 10
    reasons.push("kamu etkisi orta-yüksek")
  }

  if (scores.freshnessScore >= 85) {
    score += 12
    reasons.push("çok taze")
  } else if (scores.freshnessScore >= 50) {
    score += 6
  }

  if (scores.momentumScore >= 50) {
    score += 10
    reasons.push("kısa sürede hareketlenme var")
  }

  const topTweet = cluster.relatedTweets.reduce((best, tweet) => {
    return tweet.engagementScore > best ? tweet.engagementScore : best
  }, 0)
  if (topTweet >= 500) {
    score += 14
    reasons.push("etkileşimi yüksek")
  } else if (topTweet >= 100) {
    score += 8
  }

  const priority: SingleSourcePriority =
    score >= 78 && (scores.signalType === "breaking_event" || scores.publicImpactScore >= 90) ? "critical" :
    score >= 58 ? "high" :
    score >= 36 ? "medium" :
    "low"

  return {
    priority,
    reason: reasons.length > 0
      ? `Tek kaynaklı sinyal ama ${reasons.slice(0, 3).join(", ")}.`
      : "Tek kaynaklı sinyal; ikinci kaynak veya resmi teyit beklenmeli.",
  }
}

function getAgendaTier(score: number, signalCount: number, needsConfirmation: boolean, isRoutine: boolean): AgendaTier {
  if (isRoutine) return "routine"
  if (needsConfirmation || signalCount === 1) return "single_source"
  if (score >= 80) return "lead"
  if (score >= 60) return "major"
  return "watch"
}

function buildSourceLine(cluster: AgendaCluster) {
  const sourceNames = [...cluster.sourceNames].filter(Boolean).slice(0, 4)
  if (sourceNames.length === 0) {
    return "Bu başlık son 24 saatteki açık kaynak paylaşımlarından derlendi."
  }

  const suffix = cluster.sourceNames.size > sourceNames.length ? ` ve ${cluster.sourceNames.size - sourceNames.length} kaynak daha` : ""
  return `${sourceNames.join(", ")}${suffix} üzerinden takip edildi.`
}

function buildNewsFormat(cluster: AgendaCluster, topic: {
  title: string
  summary: string
  whyItMatters: string
  watchNext: string
}) {
  const latestSignal = [...cluster.relatedTweets]
    .sort((left, right) => new Date(right.publishedAt ?? right.fetchedAt ?? 0).getTime() - new Date(left.publishedAt ?? left.fetchedAt ?? 0).getTime())[0]
  const latestArticle = [...cluster.relatedArticles]
    .sort((left, right) => new Date(right.publishedAt ?? right.processedAt ?? 0).getTime() - new Date(left.publishedAt ?? left.processedAt ?? 0).getTime())[0]
  const latestText = latestSignal
    ? `${latestSignal.authorDisplayName ?? latestSignal.authorUsername ?? "Bir kaynak"} konuyla ilgili yeni bir paylaşım yaptı.`
    : latestArticle
      ? `${latestArticle.sourceName ?? "Bir kaynak"} başlığı haberleştirdi.`
      : "Başlık son 24 saat içinde gündeme girdi."

  return {
    headline: topic.title,
    spot: topic.summary,
    body: `${topic.summary} ${topic.whyItMatters}`.replace(/\s+/g, " ").trim(),
    latest: latestText,
    context: topic.watchNext,
    sourceLine: buildSourceLine(cluster),
  }
}

function buildEvidencePackage(cluster: AgendaCluster, sourceCoverageScore: number) {
  const topTweets = [...cluster.relatedTweets]
    .sort((left, right) => right.engagementScore - left.engagementScore)
    .slice(0, 8)
  const topArticles = [...cluster.relatedArticles].slice(0, 8)

  return {
    firstSeenAt: cluster.firstSeenAt,
    lastUpdatedAt: cluster.lastUpdatedAt,
    sourceCount: cluster.sourceNames.size,
    officialSourceCount: cluster.officialSourceNames.size,
    tweetCount: cluster.relatedTweets.length,
    newsCount: cluster.relatedArticles.length,
    sourceCategories: [...cluster.sourceCategories].sort(),
    sourceCoverageScore,
    topTweets,
    topArticles,
  }
}

function countTokenMatches(tokens: string[], lookup: Set<string>) {
  return tokens.reduce((count, token) => count + (lookup.has(token) ? 1 : 0), 0)
}

function hasCategory(cluster: AgendaCluster, ...categories: string[]) {
  return categories.some((category) => cluster.sourceCategories.has(category))
}

function getClassificationText(cluster: AgendaCluster) {
  return normalizeText([
    cluster.title,
    cluster.summary,
    ...cluster.relatedArticles.slice(0, 3).flatMap((article) => [article.title, article.summary]),
    ...cluster.relatedTweets.slice(0, 5).map((tweet) => tweet.content),
  ].join(" "))
}

function classifyAgendaCluster(cluster: AgendaCluster): {
  signalType: AgendaDetectionType
  confidenceLevel: ConfidenceLevel
  needsConfirmation: boolean
  isRoutine: boolean
  detectionReason: string
} {
  const text = getClassificationText(cluster)
  const tokens = tokenize(text)
  const breakingMatches = countTokenMatches(tokens, BREAKING_EVENT_TOKENS)
  const officialMatches = countTokenMatches(tokens, OFFICIAL_STATEMENT_TOKENS)
  const politicalMatches = countTokenMatches(tokens, POLITICAL_TOKENS)
  const routineMatches = countTokenMatches(tokens, ROUTINE_ACTIVITY_TOKENS)
  const sportsMatches = countTokenMatches(tokens, SPORTS_TOKENS)
  const marketMatches = countTokenMatches(tokens, MARKET_TOKENS)
  const isOfficial = cluster.officialSourceNames.size > 0
  const isMedia = hasCategory(cluster, "medya", "ajans", "haber", "gazete", "kurumsal")
  const isRoutine = routineMatches > 0 && breakingMatches === 0

  let signalType: AgendaDetectionType = "unknown"
  let detectionReason = "Genel gündem sinyali olarak yakalandı."

  if (breakingMatches > 0) {
    signalType = "breaking_event"
    detectionReason = "Olay/son dakika ifadesi taşıyan taze sinyal bulundu."
  } else if (isOfficial || officialMatches > 0) {
    signalType = "official_statement"
    detectionReason = "Resmi kaynak veya açıklama/duyuru dili taşıyor."
  } else if (marketMatches > 0 || hasCategory(cluster, "ekonomi", "finans")) {
    signalType = "market_update"
    detectionReason = "Ekonomi veya piyasa gündemiyle ilişkili sinyal bulundu."
  } else if (sportsMatches > 0 || hasCategory(cluster, "spor")) {
    signalType = "sports_update"
    detectionReason = "Spor gündemiyle ilişkili sinyal bulundu."
  } else if (
    politicalMatches > 0 ||
    hasCategory(
      cluster,
      "siyaset",
      "politika",
      "siyasetci",
      "milletvekili",
      "bakan",
      "devlet_yonetimi",
      "belediye_baskani",
      "siyasi_lider",
      "istanbul_siyaset",
      "yerel_yonetim",
    )
  ) {
    signalType = "political_statement"
    detectionReason = "Siyasi aktör, kurum veya parti bağlamı taşıyor."
  } else if (isRoutine) {
    signalType = "routine_activity"
    detectionReason = "Ziyaret, toplantı, kutlama veya program gibi rutin faaliyet dili taşıyor."
  } else if (isMedia || cluster.relatedArticles.length > 0) {
    signalType = "media_report"
    detectionReason = "Medya/haber kaynağından gelen raporlama sinyali."
  }

  const confidenceLevel: ConfidenceLevel =
    isOfficial && cluster.sourceNames.size >= 2
      ? "high"
      : cluster.sourceNames.size >= 3 || cluster.highTrustSourceNames.size >= 2
        ? "high"
        : isOfficial || cluster.sourceNames.size >= 2 || cluster.highTrustSourceNames.size >= 1
          ? "medium"
          : "low"

  return {
    signalType,
    confidenceLevel,
    needsConfirmation: confidenceLevel === "low" && !isOfficial,
    isRoutine,
    detectionReason,
  }
}

function dedupeBySlug<T extends { slug: string; importanceScore: number }>(items: T[]) {
  const seen = new Map<string, T>()

  for (const item of items) {
    const current = seen.get(item.slug)
    if (!current || item.importanceScore > current.importanceScore) {
      seen.set(item.slug, item)
    }
  }

  return [...seen.values()]
}

async function getAgendaSignals() {
  const includeRssAgenda = process.env.D4ILY_INCLUDE_RSS_AGENDA === "true"
  const activeRssRows = includeRssAgenda
    ? await db
        .select({ id: rssSources.id })
        .from(rssSources)
        .where(eq(rssSources.is_active, true))
        .limit(1)
    : []
  const includeArticleSignals = includeRssAgenda && activeRssRows.length > 0

  const [articleRows, rawNewsRows, tweetRows] = await Promise.all([
    includeArticleSignals
      ? db
          .select({
            id: processedArticles.id,
            title: processedArticles.title,
            summary: processedArticles.summary,
            sourceName: processedArticles.source_name,
            category: processedArticles.category,
            publishedAt: processedArticles.published_at,
            processedAt: processedArticles.processed_at,
            originalNewsId: processedArticles.original_news_id,
          })
          .from(processedArticles)
          .where(eq(processedArticles.is_published, true))
          .orderBy(desc(processedArticles.processed_at))
          .limit(180)
      : Promise.resolve([]),
    includeArticleSignals
      ? db
          .select({
            id: newsRaw.id,
            title: newsRaw.title,
            summary: newsRaw.summary_raw,
            sourceName: newsRaw.source_name,
            url: newsRaw.url,
            publishedAt: newsRaw.published_at,
            fetchedAt: newsRaw.fetched_at,
          })
          .from(newsRaw)
          .orderBy(desc(newsRaw.fetched_at))
          .limit(500)
      : Promise.resolve([]),
    getRecentTweetRows(),
  ])

  const processedArticleSignals: ArticleSignal[] = articleRows
    .filter((row) => isRecentlyPublished(row.publishedAt, row.processedAt))
    .map((row) => {
      const text = `${row.title} ${row.summary}`
      return {
        type: "article",
        id: row.id,
        title: row.title,
        summary: row.summary,
        sourceName: row.sourceName,
        category: row.category,
        publishedAt: normalizeSignalDate(row.publishedAt),
        processedAt: normalizeSignalDate(row.processedAt) ?? row.processedAt,
        normalizedText: normalizeText(text),
        tokens: getClusterBodyTokens(text),
        titleTokens: getClusterTitleTokens(row.title),
      }
    })

  const processedOriginalNewsIds = new Set(
    articleRows
      .map((row) => row.originalNewsId)
      .filter((id): id is number => id !== null),
  )

  const rawArticleSignals: ArticleSignal[] = getSourceBalancedRows(rawNewsRows, RAW_NEWS_SOURCE_LIMIT)
    .filter((row) => !processedOriginalNewsIds.has(row.id))
    .filter((row) => row.title && row.summary && isRecentlyPublished(row.publishedAt, row.fetchedAt))
    .map((row) => {
      const title = row.title ?? "Haber sinyali"
      const summary = row.summary ?? ""
      const text = `${title} ${summary}`

      return {
        type: "article",
        id: row.id,
        title,
        summary,
        sourceName: row.sourceName,
        category: "Gündem",
        publishedAt: normalizeSignalDate(row.publishedAt),
        processedAt: normalizeSignalDate(row.fetchedAt) ?? row.fetchedAt,
        url: row.url,
        normalizedText: normalizeText(text),
        tokens: getClusterBodyTokens(text),
        titleTokens: getClusterTitleTokens(title),
      }
    })

  const tweetSignals: TweetSignal[] = getAuthorBalancedRows(tweetRows, TWEET_SOURCE_LIMIT)
    .map((row) => {
      const rawText = extractTweetText(row.raw_payload)
      const text = cleanTweetText(rawText)
      if (!text || text.length < 20) {
        return null
      }

      const signal = {
        type: "tweet" as const,
        id: row.id,
        tweetId: row.tweet_id,
        authorUsername: row.author_username,
        authorDisplayName: extractTweetDisplayName(row.raw_payload),
        content: text,
        publishedAt: normalizeSignalDate(row.published_at),
        fetchedAt: normalizeSignalDate(row.fetched_at) ?? row.fetched_at,
        tweetUrl: buildTweetUrl(row.tweet_id, row.author_username),
        engagementScore: getTweetEngagementScore(row),
        normalizedText: normalizeText(text),
        tokens: getClusterBodyTokens(text),
        titleTokens: getClusterTitleTokens(text),
      }

      return isRecentlyPublished(signal.publishedAt, signal.fetchedAt) ? signal : null
    })
    .filter((item): item is TweetSignal => item !== null)

  return [...processedArticleSignals, ...rawArticleSignals, ...tweetSignals]
}

async function getAgendaSourceMeta() {
  const [twitterRows, rssRows] = await Promise.all([
    db.select({
      username: twitterAccounts.username,
      trustScore: twitterAccounts.trust_score,
      isOfficial: twitterAccounts.is_official,
      category: twitterAccounts.category,
    }).from(twitterAccounts),
    db.select({
      name: rssSources.name,
      trustScore: rssSources.trust_score,
      isOfficial: rssSources.is_official,
      category: rssSources.category,
    }).from(rssSources),
  ])

  const sourceMeta = new Map<string, AgendaSourceMeta>()

  for (const row of twitterRows) {
    sourceMeta.set(sourceKey(row.username), {
      trustScore: row.trustScore ?? 3,
      isOfficial: row.isOfficial ?? false,
      category: row.category,
    })
  }

  for (const row of rssRows) {
    sourceMeta.set(sourceKey(row.name), {
      trustScore: row.trustScore ?? 3,
      isOfficial: row.isOfficial ?? false,
      category: row.category,
    })
  }

  return sourceMeta
}

function addSourceToCluster(cluster: AgendaCluster, sourceName: string | null, sourceMeta: Map<string, AgendaSourceMeta>) {
  if (!sourceName) {
    return
  }

  cluster.sourceNames.add(sourceName)

  const meta = sourceMeta.get(sourceKey(sourceName))
  if (!meta) {
    return
  }

  if (meta.trustScore >= 4) {
    cluster.highTrustSourceNames.add(sourceName)
  }

  if (meta.isOfficial) {
    cluster.officialSourceNames.add(sourceName)
  }

  if (meta.category) {
    cluster.sourceCategories.add(meta.category.toLocaleLowerCase("tr-TR"))
  }
}

function buildAgendaClusters(signals: AgendaSignal[], sourceMeta: Map<string, AgendaSourceMeta>) {
  const clusters: AgendaCluster[] = []

  for (const signal of signals) {
    const matchedCluster = clusters.find((cluster) => {
      const overlap = getOverlapScore(signal.tokens, cluster.keywordSet)
      const titleMatches = hasStrongTitleMatch(signal.titleTokens, cluster.titleKeywordSet)
      const tokenMatches = getMatchCount(signal.tokens, cluster.keywordSet)

      if (signal.type === "article") {
        return titleMatches
      }

      if (cluster.relatedArticles.length > 0) {
        return titleMatches
      }

      return titleMatches || (overlap >= 0.42 && tokenMatches >= 4)
    })

    if (!matchedCluster) {
      const title = signal.type === "article" ? signal.title : buildReadableText(signal.content, 100)
      const slug = buildSlug(title)
      const category = signal.type === "article" ? signal.category ?? "Gündem" : "Gündem"
      const cluster: AgendaCluster = {
        id: slug,
        slug,
        title,
        summary: signal.type === "article" ? signal.summary : buildReadableText(signal.content, 220),
        category,
        keywords: [...signal.tokens.slice(0, 6)],
        keywordSet: new Set(signal.tokens),
        titleKeywordSet: new Set(signal.titleTokens),
        relatedArticles: [],
        relatedTweets: [],
        sourceNames: new Set(),
        sourceCategories: new Set(),
        highTrustSourceNames: new Set(),
        officialSourceNames: new Set(),
        firstSeenAt: null,
        lastUpdatedAt: null,
        totalEngagement: 0,
        representativeSignals: [],
      }

      if (signal.type === "article") {
        cluster.relatedArticles.push({
          id: signal.id,
          title: signal.title,
          summary: signal.summary,
          sourceName: signal.sourceName,
          category: signal.category,
          publishedAt: signal.publishedAt,
          processedAt: signal.processedAt,
          url: signal.url,
        })
        addSourceToCluster(cluster, signal.sourceName, sourceMeta)
        updateTimestamps(cluster, signal.publishedAt ?? signal.processedAt)
      } else {
        cluster.relatedTweets.push({
          id: signal.id,
          tweetId: signal.tweetId,
          authorUsername: signal.authorUsername,
          authorDisplayName: signal.authorDisplayName,
          content: signal.content,
          publishedAt: signal.publishedAt,
          fetchedAt: signal.fetchedAt,
          tweetUrl: signal.tweetUrl,
          engagementScore: signal.engagementScore,
        })
        addSourceToCluster(cluster, signal.authorUsername, sourceMeta)
        cluster.totalEngagement += signal.engagementScore
        updateTimestamps(cluster, signal.publishedAt ?? signal.fetchedAt)
      }

      cluster.representativeSignals.push(buildRepresentativeSignal(signal))
      clusters.push(cluster)
      continue
    }

    signal.tokens.forEach((token) => matchedCluster.keywordSet.add(token))
    signal.titleTokens.forEach((token) => matchedCluster.titleKeywordSet.add(token))
    matchedCluster.keywords = [...matchedCluster.keywordSet].slice(0, 8)

    if (signal.type === "article") {
      matchedCluster.relatedArticles.push({
        id: signal.id,
        title: signal.title,
        summary: signal.summary,
        sourceName: signal.sourceName,
        category: signal.category,
        publishedAt: signal.publishedAt,
        processedAt: signal.processedAt,
        url: signal.url,
      })
      addSourceToCluster(matchedCluster, signal.sourceName, sourceMeta)
      updateTimestamps(matchedCluster, signal.publishedAt ?? signal.processedAt)
    } else {
      matchedCluster.relatedTweets.push({
        id: signal.id,
        tweetId: signal.tweetId,
        authorUsername: signal.authorUsername,
        authorDisplayName: signal.authorDisplayName,
        content: signal.content,
        publishedAt: signal.publishedAt,
        fetchedAt: signal.fetchedAt,
        tweetUrl: signal.tweetUrl,
        engagementScore: signal.engagementScore,
      })
      addSourceToCluster(matchedCluster, signal.authorUsername, sourceMeta)
      matchedCluster.totalEngagement += signal.engagementScore
      updateTimestamps(matchedCluster, signal.publishedAt ?? signal.fetchedAt)
    }

    if (matchedCluster.representativeSignals.length < 4) {
      matchedCluster.representativeSignals.push(buildRepresentativeSignal(signal))
    }
  }

  return clusters
}

function toAgendaTopic(cluster: AgendaCluster): AgendaTopicDetail {
  cluster.title = chooseTitle(cluster)
  cluster.slug = buildSlug(cluster.title)
  cluster.summary = buildSummary(cluster)

  const importanceScore = scoreCluster(cluster)
  const verification = getVerification(cluster)
  const classification = classifyAgendaCluster(cluster)
  const signalCount = cluster.relatedArticles.length + cluster.relatedTweets.length
  const freshnessScore = getFreshnessScore(cluster)
  const sourceDiversityScore = getSourceDiversityScore(cluster)
  const sourceCoverageScore = getSourceCoverageScore(cluster)
  const publicImpactScore = getPublicImpactScore(cluster, classification.signalType, classification.isRoutine)
  const momentumScore = getMomentumScore(cluster)
  const agendaScore = getAgendaScore({
    importanceScore,
    freshnessScore,
    sourceDiversityScore,
    publicImpactScore,
    momentumScore,
    confidenceLevel: classification.confidenceLevel,
    needsConfirmation: classification.needsConfirmation,
    isRoutine: classification.isRoutine,
  })
  const storyStatus = getStoryStatus(classification.confidenceLevel, classification.needsConfirmation)
  const agendaTier = getAgendaTier(agendaScore, signalCount, classification.needsConfirmation, classification.isRoutine)
  const singleSource = getSingleSourcePriority(cluster, {
    signalCount,
    signalType: classification.signalType,
    freshnessScore,
    publicImpactScore,
    momentumScore,
    needsConfirmation: classification.needsConfirmation,
    isRoutine: classification.isRoutine,
  })

  const watchNext = buildWatchNext(cluster, verification.status)
  const baseTopicText = {
    title: cluster.title,
    summary: cluster.summary,
    whyItMatters: buildWhyItMatters(cluster),
    watchNext,
  }

  return {
    id: cluster.slug,
    slug: cluster.slug,
    title: baseTopicText.title,
    summary: baseTopicText.summary,
    whyItMatters: baseTopicText.whyItMatters,
    category: cluster.category,
    importanceScore,
    agendaScore,
    freshnessScore,
    sourceDiversityScore,
    sourceCoverageScore,
    sourceCoverageLevel: getSourceCoverageLevel(sourceCoverageScore),
    publicImpactScore,
    momentumScore,
    agendaTier,
    storyStatus,
    singleSourcePriority: singleSource.priority,
    singleSourceReason: singleSource.reason,
    verificationStatus: verification.status,
    verificationReason: verification.reason,
    signalType: classification.signalType,
    confidenceLevel: classification.confidenceLevel,
    needsConfirmation: classification.needsConfirmation,
    isRoutine: classification.isRoutine,
    detectionReason: classification.detectionReason,
    signalCount,
    sourceCount: cluster.sourceNames.size,
    officialSourceCount: cluster.officialSourceNames.size,
    newsCount: cluster.relatedArticles.length,
    tweetCount: cluster.relatedTweets.length,
    firstSeenAt: cluster.firstSeenAt,
    lastUpdatedAt: cluster.lastUpdatedAt,
    representativeSignals: cluster.representativeSignals,
    watchNext,
    relatedArticles: cluster.relatedArticles.slice(0, 10),
    relatedTweets: cluster.relatedTweets
      .sort((left, right) => right.engagementScore - left.engagementScore)
      .slice(0, 10),
    keywords: cluster.keywords,
    newsFormat: buildNewsFormat(cluster, baseTopicText),
    evidencePackage: buildEvidencePackage(cluster, sourceCoverageScore),
  }
}

async function buildAgendaTopicCollection() {
  const [signals, sourceMeta] = await Promise.all([
    getAgendaSignals(),
    getAgendaSourceMeta(),
  ])
  const clusters = buildAgendaClusters(signals, sourceMeta)

  return dedupeBySlug(
    clusters
      .map(toAgendaTopic)
      .sort((left, right) => right.agendaScore - left.agendaScore || right.importanceScore - left.importanceScore),
  )
}

function isFeaturedTopic(topic: AgendaTopicDetail) {
  if (topic.newsCount > 0 && topic.sourceCount >= 2) {
    return true
  }

  if (topic.tweetCount > 0 && topic.sourceCount >= 2) {
    return true
  }

  return topic.officialSourceCount > 0 && topic.signalCount >= 2
}

export async function getAgendaTopics(limit: number, mode: "all" | "featured" = "all") {
  const topics = await buildAgendaTopicCollection()
  const filteredTopics = mode === "featured" ? topics.filter(isFeaturedTopic) : topics
  return filteredTopics.slice(0, limit)
}

export async function getAgendaTopicBySlug(slug: string) {
  const topics = await buildAgendaTopicCollection()
  return topics.find((topic) => topic.slug === slug) ?? null
}

const missedAgendaPriorityRank = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

export async function getMissedAgendaAlerts(limit: number) {
  const topics = await buildAgendaTopicCollection()

  return topics
    .filter((topic) => (
      topic.singleSourcePriority === "critical" ||
      topic.singleSourcePriority === "high" ||
      topic.needsConfirmation ||
      topic.signalCount === 1
    ))
    .sort((left, right) => {
      const priorityDelta = missedAgendaPriorityRank[right.singleSourcePriority] - missedAgendaPriorityRank[left.singleSourcePriority]
      if (priorityDelta !== 0) return priorityDelta

      const freshnessDelta = right.freshnessScore - left.freshnessScore
      if (freshnessDelta !== 0) return freshnessDelta

      const impactDelta = right.publicImpactScore - left.publicImpactScore
      if (impactDelta !== 0) return impactDelta

      return right.agendaScore - left.agendaScore
    })
    .slice(0, limit)
    .map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      alertLevel: topic.singleSourcePriority === "critical" ? "critical" : topic.singleSourcePriority === "high" ? "high" : "watch",
      reason: topic.singleSourceReason ?? (
        topic.needsConfirmation
          ? "Teyit bekleyen ama kaybolmaması gereken başlık."
          : "Tek kaynaklı olduğu için kaçan gündem alarmında tutuluyor."
      ),
      signalType: topic.signalType,
      confidenceLevel: topic.confidenceLevel,
      singleSourcePriority: topic.singleSourcePriority,
      sourceCoverageScore: topic.sourceCoverageScore,
      freshnessScore: topic.freshnessScore,
      publicImpactScore: topic.publicImpactScore,
      firstSeenAt: topic.firstSeenAt,
      lastUpdatedAt: topic.lastUpdatedAt,
      evidencePackage: topic.evidencePackage,
      newsFormat: topic.newsFormat,
    }))
}
