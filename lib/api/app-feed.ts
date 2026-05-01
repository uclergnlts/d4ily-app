import { sql } from "drizzle-orm"

import type { AgendaRelatedTweet, AgendaTopicDetail } from "@/lib/api/agenda"
import { getAgendaTopicBySlug, getAgendaTopics } from "@/lib/api/agenda"
import { db } from "@/lib/db"
import { twitterAccounts } from "@/lib/db/schema"

type SourceRole = "official" | "journalist" | "politician" | "media" | "local" | "ngo" | "expert" | "source"
type StoryStatusLabel = "Netleşti" | "Gelişiyor" | "Teyit bekliyor"
type DataFreshnessStatus = "fresh" | "aging" | "stale" | "empty"
type AppStoryType = "breaking" | "politics" | "public" | "economy" | "local" | "sports" | "general"
type TopicChipType = "keyword" | "hashtag" | "place"

type SourceProfile = {
  username: string
  displayName: string | null
  category: string | null
  isOfficial: boolean
  trustScore: number
}

export type AppFeedTweet = {
  tweetId: string
  authorUsername: string | null
  authorDisplayName: string | null
  authorRole: SourceRole
  content: string
  tweetUrl: string | null
  publishedAt: string | null
  engagementScore: number
}

export type AppFeedTopicChip = {
  label: string
  type: TopicChipType
}

export type AppFeedStory = {
  id: string
  slug: string
  headline: string
  summary: string
  body: string
  whyItMatters: string
  watchNext: string
  category: string
  storyType: AppStoryType
  topicChips: AppFeedTopicChip[]
  statusLabel: StoryStatusLabel
  badges: string[]
  updatedAt: string | null
  primaryTweet: AppFeedTweet | null
  supportingTweets: AppFeedTweet[]
  newsFormat: AgendaTopicDetail["newsFormat"]
  evidencePackage: AgendaTopicDetail["evidencePackage"]
  metadata: {
    agendaTier: AgendaTopicDetail["agendaTier"]
    storyStatus: AgendaTopicDetail["storyStatus"]
    agendaScore: number
    displayScore: number
    freshnessScore: number
    sourceCoverageScore: number
    sourceCoverageLevel: AgendaTopicDetail["sourceCoverageLevel"]
    publicImpactScore: number
    sourceCount: number
    tweetCount: number
    signalCount: number
    singleSourcePriority: AgendaTopicDetail["singleSourcePriority"]
    sourceMix: Partial<Record<SourceRole, number>>
  }
}

export type AppFeedLatestSignal = {
  id: string
  headline: string
  summary: string
  statusLabel: StoryStatusLabel
  badges: string[]
  topicChips: AppFeedTopicChip[]
  updatedAt: string | null
  linkedStoryId: string
  supportingTweet: AppFeedTweet | null
}

export type AppFeedActorReaction = {
  storyId: string
  headline: string
  reactions: Array<AppFeedTweet & {
    actorName: string
    roleLabel: string
  }>
}

export type AppFeedDevelopingStory = {
  id: string
  headline: string
  summary: string
  whyWatch: string
  topicChips: AppFeedTopicChip[]
  updatedAt: string | null
  supportingTweets: AppFeedTweet[]
}

export type AppFeedLocalAgenda = {
  city: string
  storyId: string
  headline: string
  summary: string
  topicChips: AppFeedTopicChip[]
  updatedAt: string | null
  supportingTweets: AppFeedTweet[]
}

export type AppFeed = {
  generatedAt: string
  windowHours: 24
  dataHealth: {
    status: DataFreshnessStatus
    newestTweetAt: string | null
    newestTweetAgeMinutes: number | null
    totalTopics: number
    activeSourceCount: number
    warning: string | null
  }
  todayAgenda: {
    title: "Bugünün Gündemi"
    lead: string
    mainStories: AppFeedStory[]
    moreStories: AppFeedStory[]
  quickBrief: Array<{
      id: string
      headline: string
      summary: string
      badges: string[]
      topicChips: AppFeedTopicChip[]
      updatedAt: string | null
    }>
  }
  latestSignals: AppFeedLatestSignal[]
  actorReactions: AppFeedActorReaction[]
  developingStories: AppFeedDevelopingStory[]
  localAgenda: AppFeedLocalAgenda[]
  facets: {
    storyTypes: Array<{
      type: AppStoryType
      label: string
      count: number
    }>
    topChips: Array<{
      label: string
      type: TopicChipType
      count: number
    }>
  }
  counts: {
    totalTopics: number
    todayAgenda: number
    latestSignals: number
    actorReactions: number
    developingStories: number
    localAgenda: number
  }
}

export type AppFeedStoryDetail = AppFeedStory & {
  allTweets: AppFeedTweet[]
  relatedStories: Array<{
    id: string
    slug: string
    headline: string
    summary: string
    storyType: AppStoryType
    badges: string[]
    topicChips: AppFeedTopicChip[]
    updatedAt: string | null
  }>
}

export type AppFeedCacheMeta = {
  hit: boolean
  key: string
  ttlSeconds: number
  cachedAt: string | null
}

const TECHNICAL_PHRASES = [
  /sistem (bu başlığı|konuyu).*?(yakaladı|öne çıkardı)\.?/giu,
  /çok kaynaklı ve güçlü ana gündem olarak yakaladı\.?/giu,
  /çok kaynaklı sinyal/giu,
  /tek kaynaklı sinyal/giu,
  /gündem sinyali/giu,
  /sosyal sinyal/giu,
  /sinyaller/giu,
  /sinyal/giu,
  /paketlendi/giu,
]

const ROLE_LABELS: Record<SourceRole, string> = {
  official: "Resmi kaynak",
  journalist: "Gazeteci",
  politician: "Siyasi aktör",
  media: "Medya",
  local: "Yerel kaynak",
  ngo: "STK/meslek örgütü",
  expert: "Uzman",
  source: "Kaynak",
}

const ROLE_PRIORITY: Record<SourceRole, number> = {
  official: 85,
  journalist: 82,
  politician: 78,
  media: 72,
  ngo: 68,
  expert: 64,
  local: 62,
  source: 25,
}

const BADGE_LABELS = {
  breaking: "Son dakika",
  official: "Resmi açıklama var",
  developing: "Gelişiyor",
  needsConfirmation: "Teyit bekliyor",
  singleSource: "Tek kaynak",
  local: "Yerel gündem",
} as const

const STORY_TYPE_LABELS: Record<AppStoryType, string> = {
  breaking: "Son Dakika",
  politics: "Siyaset",
  public: "Kamu",
  economy: "Ekonomi",
  local: "Yerel",
  sports: "Spor",
  general: "Genel",
}

const CHIP_BLOCKLIST = new Set([
  "gündem",
  "gundem",
  "son",
  "yeni",
  "açıklama",
  "aciklama",
  "başlık",
  "baslik",
  "haber",
  "paylaşım",
  "paylasim",
  "bugün",
  "bugun",
  "dedi",
  "alın",
  "alin",
  "terinin",
  "emeğin",
  "emegin",
  "ülkemizin",
  "ulkemizin",
  "karşılığını",
  "karsiligini",
  "altındayız",
  "altindayiz",
  "önce",
  "once",
  "bize",
  "belli",
])

const LOCAL_EVENT_TERMS = [
  "belediye",
  "valilik",
  "kaymakamlık",
  "kaza",
  "yangın",
  "deprem",
  "sel",
  "patlama",
  "gözaltı",
  "tutuklama",
  "tahliye",
  "mahkeme",
  "yasak",
  "protesto",
  "müdahale",
  "hayatını kaybetti",
  "yaralı",
  "ulaşım",
  "metro",
  "otobüs",
  "açılış",
  "kutlama",
  "kutlamaları",
]

const NATIONAL_CONTEXT_TERMS = [
  "tbmm",
  "meclis genel kurulu",
  "israil",
  "abd",
  "iran",
  "küresel sumud",
  "sumud filosu",
]

const APP_FEED_CACHE_TTL_MS = Math.max(
  0,
  Number.parseInt(process.env.APP_FEED_CACHE_TTL_SECONDS ?? "45", 10) * 1000,
)

const appFeedCache = new Map<string, {
  value: AppFeed
  cachedAt: number
}>()

const CITY_ALIASES: Array<{ city: string; patterns: string[] }> = [
  { city: "İstanbul", patterns: ["istanbul", "ibb", "taksim", "kadıköy", "üsküdar", "beşiktaş", "saraçhane"] },
  { city: "Ankara", patterns: ["ankara", "çankaya", "keçiören", "mamak", "altındağ", "tbmm"] },
  { city: "İzmir", patterns: ["izmir", "konak", "karşıyaka", "bornova"] },
  { city: "Bursa", patterns: ["bursa", "nilüfer", "osmangazi", "yıldırım"] },
  { city: "Balıkesir", patterns: ["balıkesir", "edremit", "bandırma"] },
  { city: "Antalya", patterns: ["antalya", "muratpaşa", "alanya"] },
  { city: "Çorum", patterns: ["çorum", "laçin", "kırıkdilim"] },
  { city: "Adana", patterns: ["adana", "seyhan", "çukurova"] },
  { city: "Konya", patterns: ["konya", "selçuklu", "karatay"] },
  { city: "Gaziantep", patterns: ["gaziantep", "antep", "şahinbey"] },
  { city: "Diyarbakır", patterns: ["diyarbakır", "amed", "sur", "bağlar"] },
  { city: "Mersin", patterns: ["mersin", "akdeniz", "tarsus"] },
  { city: "Hatay", patterns: ["hatay", "antakya", "iskenderun"] },
  { city: "Kocaeli", patterns: ["kocaeli", "izmit", "gebze"] },
  { city: "Kayseri", patterns: ["kayseri", "melikgazi"] },
  { city: "Samsun", patterns: ["samsun", "atakum"] },
  { city: "Trabzon", patterns: ["trabzon", "ortahisar"] },
  { city: "Erzurum", patterns: ["erzurum", "yakutiye"] },
  { city: "Van", patterns: ["van", "ipekyolu"] },
  { city: "Şanlıurfa", patterns: ["şanlıurfa", "urfa", "haliliye"] },
]

function normalizeLookup(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
}

function cleanDisplayText(value: string, maxLength: number) {
  let cleaned = value
    .replace(/^RT\s+@[\w_]+:\s*/i, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0E\uFE0F]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  for (const phrase of TECHNICAL_PHRASES) {
    cleaned = cleaned.replace(phrase, "")
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim()

  if (cleaned.length <= maxLength) {
    return cleaned
  }

  const sentenceEnd = cleaned.slice(0, maxLength).search(/[.!?]\s[^.!?]*$/)
  if (sentenceEnd > 60) {
    return cleaned.slice(0, sentenceEnd + 1).trim()
  }

  return `${cleaned.slice(0, maxLength).trim()}...`
}

function cleanSentence(value: string, fallback: string, maxLength = 220) {
  const cleaned = cleanDisplayText(value, maxLength)
    .replace(/Konu\s+\d+\s+haber.*?öne çıkıyor\.?/giu, "")
    .replace(/Birden fazla kaynakta haber sinyali var;?/giu, "")
    .replace(/Resmi teyit henüz görünmüyor\.?/giu, "")
    .replace(/ikinci kaynak veya resmi teyit beklenmeli\.?/giu, "")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned || fallback
}

function getUserFacingWhy(topic: AgendaTopicDetail) {
  if (topic.signalType === "breaking_event") {
    return "Başlık yeni gelişme içeriyor ve kısa sürede gündemin üst sıralarına çıktı."
  }

  if (topic.officialSourceCount > 0) {
    return "Başlık resmi açıklama veya birincil kaynakla destekleniyor."
  }

  if (topic.sourceCount >= 3) {
    return "Başlık farklı kaynaklarda aynı anda görünür hale geldi."
  }

  if (topic.singleSourcePriority === "critical" || topic.singleSourcePriority === "high") {
    return "Başlık şimdilik sınırlı kaynaktan geliyor ama kamu etkisi yüksek olabilir."
  }

  if (topic.publicImpactScore >= 70) {
    return "Başlık kamu hayatını etkileyebilecek bir gelişmeye işaret ediyor."
  }

  return cleanSentence(topic.whyItMatters, "Başlık gün içinde takip edilmeye değer görünüyor.")
}

function getUserFacingWatchNext(topic: AgendaTopicDetail) {
  if (topic.needsConfirmation || topic.storyStatus === "needs_confirmation") {
    return "Yeni açıklama, ikinci kaynak veya resmi bilgi geldikçe başlık netleşebilir."
  }

  if (topic.signalType === "breaking_event") {
    return "Yeni ayrıntılar, resmi açıklamalar ve sahadan gelen paylaşımlar izlenmeli."
  }

  if (topic.officialSourceCount > 0) {
    return "Açıklamanın uygulama detayları ve yeni kurum paylaşımları takip edilmeli."
  }

  if (topic.storyStatus === "developing") {
    return "Başlık hareketli; yeni ayrıntılar geldikçe güncellenebilir."
  }

  return "Konuya dair yeni açıklamalar ve güncel paylaşımlar izlenmeli."
}

function sortByNewest<T extends { lastUpdatedAt: string | null; firstSeenAt: string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime()
    const rightTime = new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime()
    return rightTime - leftTime
  })
}

function sourceKey(value: string | null) {
  return value?.replace(/^@/, "").toLocaleLowerCase("tr-TR").trim() ?? ""
}

function includesTerm(text: string, term: string) {
  const normalizedText = ` ${normalizeLookup(text).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ")} `
  const normalizedTerm = normalizeLookup(term).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim()

  return normalizedTerm.length > 0 && normalizedText.includes(` ${normalizedTerm} `)
}

function getUpdatedAt(topic: AgendaTopicDetail) {
  return topic.lastUpdatedAt ?? topic.firstSeenAt
}

function getStatusLabel(topic: AgendaTopicDetail): StoryStatusLabel {
  if (topic.storyStatus === "confirmed") return "Netleşti"
  if (topic.storyStatus === "needs_confirmation") return "Teyit bekliyor"
  return "Gelişiyor"
}

function getStoryType(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>): AppStoryType {
  if (topic.signalType === "breaking_event") return "breaking"
  if (topic.signalType === "political_statement") return "politics"
  if (topic.signalType === "official_statement") return "public"
  if (topic.signalType === "market_update") return "economy"
  if (topic.signalType === "sports_update") return "sports"
  if (detectLocalCity(topic, profiles)) return "local"
  return "general"
}

function cleanChipLabel(value: string) {
  return cleanDisplayText(value.replace(/^#/, ""), 34)
    .replace(/[.,;:!?]+$/g, "")
    .trim()
}

function addChip(chips: AppFeedTopicChip[], seen: Set<string>, label: string, type: TopicChipType) {
  const cleaned = cleanChipLabel(label)
  const key = normalizeLookup(cleaned)
  if (!cleaned || cleaned.length < 3 || CHIP_BLOCKLIST.has(key) || seen.has(key)) {
    return
  }

  seen.add(key)
  chips.push({ label: cleaned, type })
}

function makeTopicChips(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>, max = 6) {
  const chips: AppFeedTopicChip[] = []
  const seen = new Set<string>()
  const city = detectLocalCity(topic, profiles)
  if (city) addChip(chips, seen, city, "place")

  const hashtagMatches = topic.relatedTweets
    .flatMap((tweet) => tweet.content.match(/#[\p{L}\p{N}_]+/gu) ?? [])
    .slice(0, 8)

  for (const hashtag of hashtagMatches) {
    addChip(chips, seen, hashtag, "hashtag")
    if (chips.length >= max) return chips
  }

  for (const keyword of topic.keywords) {
    addChip(chips, seen, keyword, "keyword")
    if (chips.length >= max) return chips
  }

  return chips
}

function minutesSince(value: string | null) {
  if (!value) return null

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  return Math.max(0, Math.round((Date.now() - parsed.getTime()) / 60000))
}

function getSourceRole(profile: SourceProfile | undefined): SourceRole {
  if (!profile) return "source"
  if (profile.isOfficial) return "official"

  const category = normalizeLookup(profile.category ?? "")
  if (category.includes("gazeteci")) return "journalist"
  if (
    category.includes("milletvekili") ||
    category.includes("siyas") ||
    category.includes("bakan") ||
    category.includes("parti") ||
    category.includes("belediye_baskani")
  ) {
    return "politician"
  }
  if (category.includes("medya") || category.includes("ajans") || category.includes("yerel_medya")) return "media"
  if (category.includes("yerel") || category.includes("belediye") || category.includes("valilik")) return "local"
  if (category.includes("stk") || category.includes("sendika") || category.includes("meslek") || category.includes("hak")) return "ngo"
  if (category.includes("universite") || category.includes("ekonomi") || category.includes("hukuk")) return "expert"

  return "source"
}

function isSourceRoleAllowed(role: SourceRole, allowedRoles?: Set<SourceRole>) {
  return !allowedRoles || allowedRoles.has(role)
}

function mapTweet(tweet: AgendaRelatedTweet, profiles: Map<string, SourceProfile>): AppFeedTweet {
  const profile = profiles.get(sourceKey(tweet.authorUsername))
  return {
    tweetId: tweet.tweetId,
    authorUsername: tweet.authorUsername,
    authorDisplayName: tweet.authorDisplayName ?? profile?.displayName ?? tweet.authorUsername,
    authorRole: getSourceRole(profile),
    content: cleanDisplayText(tweet.content, 320),
    tweetUrl: tweet.tweetUrl,
    publishedAt: tweet.publishedAt,
    engagementScore: tweet.engagementScore,
  }
}

function getSourceMix(tweets: AgendaRelatedTweet[], profiles: Map<string, SourceProfile>) {
  const mix: Partial<Record<SourceRole, number>> = {}

  for (const tweet of tweets) {
    const role = getSourceRole(profiles.get(sourceKey(tweet.authorUsername)))
    mix[role] = (mix[role] ?? 0) + 1
  }

  return mix
}

function getTweetRank(tweet: AgendaRelatedTweet, profiles: Map<string, SourceProfile>) {
  const profile = profiles.get(sourceKey(tweet.authorUsername))
  const role = getSourceRole(profile)
  const trustBoost = Math.max(0, (profile?.trustScore ?? 3) - 3) * 8
  const engagementBoost = Math.min(35, Math.log10(Math.max(tweet.engagementScore, 1)) * 8)

  return ROLE_PRIORITY[role] + trustBoost + engagementBoost
}

function selectSupportingTweets(
  tweets: AgendaRelatedTweet[],
  profiles: Map<string, SourceProfile>,
  options?: {
    max?: number
    allowedRoles?: Set<SourceRole>
  },
) {
  const max = options?.max ?? 4
  const seenTexts = new Set<string>()
  const seenAuthors = new Set<string>()
  const selected: AgendaRelatedTweet[] = []

  const rankedTweets = [...tweets].sort((left, right) => {
    const rankDiff = getTweetRank(right, profiles) - getTweetRank(left, profiles)
    if (rankDiff !== 0) return rankDiff
    return right.engagementScore - left.engagementScore
  })

  for (const tweet of rankedTweets) {
    const role = getSourceRole(profiles.get(sourceKey(tweet.authorUsername)))
    if (!isSourceRoleAllowed(role, options?.allowedRoles)) continue

    const normalizedText = normalizeLookup(tweet.content)
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 180)
    const author = sourceKey(tweet.authorUsername)

    if (seenTexts.has(normalizedText)) continue
    if (author && seenAuthors.has(author)) continue

    seenTexts.add(normalizedText)
    if (author) seenAuthors.add(author)
    selected.push(tweet)

    if (selected.length >= max) break
  }

  return selected
}

function isSoftRoutineTopic(topic: AgendaTopicDetail) {
  const text = normalizeLookup([
    topic.title,
    topic.summary,
    ...topic.relatedTweets.slice(0, 6).map((tweet) => tweet.content),
  ].join(" "))

  return [
    "kutlu olsun",
    "kutluyoruz",
    "tebrik",
    "basarilar",
    "ziyaret ettik",
    "agirladik",
    "bir araya geldik",
    "programina katildik",
  ].some((phrase) => text.includes(phrase))
}

function getTopicDisplayScore(topic: AgendaTopicDetail) {
  let score = topic.agendaScore

  if (topic.signalType === "breaking_event") score += 32
  if (topic.signalType === "official_statement") score += 20
  if (topic.signalType === "political_statement") score += 18
  if (topic.signalType === "market_update") score += 12
  if (topic.singleSourcePriority === "critical") score += 28
  if (topic.singleSourcePriority === "high") score += 18
  if (topic.storyStatus === "confirmed") score += 10
  if (topic.officialSourceCount > 0) score += 10
  if (topic.sourceCount >= 3) score += 8

  if (topic.signalType === "routine_activity") score -= 38
  if (topic.signalType === "sports_update") score -= 18
  if (topic.isRoutine) score -= 34
  if (isSoftRoutineTopic(topic)) score -= 28

  return score
}

function rankStoryTopics(topics: AgendaTopicDetail[]) {
  return [...topics].sort((left, right) => {
    const scoreDiff = getTopicDisplayScore(right) - getTopicDisplayScore(left)
    if (scoreDiff !== 0) return scoreDiff

    const timeDiff = new Date(getUpdatedAt(right) ?? 0).getTime() - new Date(getUpdatedAt(left) ?? 0).getTime()
    if (timeDiff !== 0) return timeDiff

    return right.agendaScore - left.agendaScore
  })
}

function getStoryBadges(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>) {
  const badges: string[] = []

  if (topic.signalType === "breaking_event") badges.push(BADGE_LABELS.breaking)
  if (topic.officialSourceCount > 0) badges.push(BADGE_LABELS.official)
  if (topic.storyStatus === "developing") badges.push(BADGE_LABELS.developing)
  if (topic.storyStatus === "needs_confirmation") badges.push(BADGE_LABELS.needsConfirmation)
  if (topic.signalCount === 1 || topic.singleSourcePriority === "critical" || topic.singleSourcePriority === "high") {
    badges.push(BADGE_LABELS.singleSource)
  }
  if (detectLocalCity(topic, profiles)) badges.push(BADGE_LABELS.local)

  return badges.slice(0, 3)
}

function makeStory(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>): AppFeedStory {
  const selectedTweets = selectSupportingTweets(topic.relatedTweets, profiles)
  const mappedTweets = selectedTweets.map((tweet) => mapTweet(tweet, profiles))
  const summary = cleanDisplayText(topic.summary, 260)
  const body = selectedTweets.length > 0
    ? cleanDisplayText(selectedTweets[0].content, 420)
    : summary

  return {
    id: topic.id,
    slug: topic.slug,
    headline: cleanDisplayText(topic.title, 120),
    summary,
    body,
    whyItMatters: getUserFacingWhy(topic),
    watchNext: getUserFacingWatchNext(topic),
    category: topic.category,
    storyType: getStoryType(topic, profiles),
    topicChips: makeTopicChips(topic, profiles),
    statusLabel: getStatusLabel(topic),
    badges: getStoryBadges(topic, profiles),
    updatedAt: getUpdatedAt(topic),
    primaryTweet: mappedTweets[0] ?? null,
    supportingTweets: mappedTweets,
    newsFormat: topic.newsFormat,
    evidencePackage: topic.evidencePackage,
    metadata: {
      agendaTier: topic.agendaTier,
      storyStatus: topic.storyStatus,
      agendaScore: topic.agendaScore,
      displayScore: getTopicDisplayScore(topic),
      freshnessScore: topic.freshnessScore,
      sourceCoverageScore: topic.sourceCoverageScore,
      sourceCoverageLevel: topic.sourceCoverageLevel,
      publicImpactScore: topic.publicImpactScore,
      sourceCount: topic.sourceCount,
      tweetCount: topic.tweetCount,
      signalCount: topic.signalCount,
      singleSourcePriority: topic.singleSourcePriority,
      sourceMix: getSourceMix(topic.relatedTweets, profiles),
    },
  }
}

function makeStoryPreview(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>) {
  return {
    id: topic.id,
    slug: topic.slug,
    headline: cleanDisplayText(topic.title, 110),
    summary: cleanDisplayText(topic.summary, 180),
    storyType: getStoryType(topic, profiles),
    badges: getStoryBadges(topic, profiles),
    topicChips: makeTopicChips(topic, profiles, 5),
    updatedAt: getUpdatedAt(topic),
  }
}

function cleanLeadHeadline(value: string) {
  const headline = cleanDisplayText(value, 88)
  if (headline.endsWith("...")) {
    return headline
  }

  return headline.replace(/[.,;:!?]+$/g, "")
}

function buildLead(stories: AppFeedStory[]) {
  const headlines = stories.slice(0, 4).map((story) => cleanLeadHeadline(story.headline))
  if (headlines.length === 0) {
    return "Bugün öne çıkan başlıklar henüz netleşmedi; akış yeni paylaşımlarla güncelleniyor."
  }

  if (headlines.length === 1) {
    return `Bugün öne çıkan başlık: ${headlines[0]}.`
  }

  return `Bugün öne çıkan başlıklar: ${headlines.join("; ")}.`
}

function makeLatestSignal(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>): AppFeedLatestSignal {
  const tweet = selectSupportingTweets(topic.relatedTweets, profiles, { max: 1 })[0]
  return {
    id: `latest-${topic.id}`,
    headline: cleanDisplayText(topic.title, 110),
    summary: cleanDisplayText(topic.summary, 180),
    statusLabel: getStatusLabel(topic),
    badges: getStoryBadges(topic, profiles),
    topicChips: makeTopicChips(topic, profiles, 5),
    updatedAt: getUpdatedAt(topic),
    linkedStoryId: topic.id,
    supportingTweet: tweet ? mapTweet(tweet, profiles) : null,
  }
}

function makeDevelopingStory(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>): AppFeedDevelopingStory {
  const whyWatch = topic.needsConfirmation || topic.signalCount === 1
    ? "Bu başlık şimdilik sınırlı kaynaktan geliyor. Yeni paylaşım veya resmi açıklama geldikçe netleşebilir."
    : "Başlık hareketli; yeni ayrıntılar geldikçe tablo değişebilir."

  return {
    id: topic.id,
    headline: cleanDisplayText(topic.title, 120),
    summary: cleanDisplayText(topic.summary, 240),
    whyWatch,
    topicChips: makeTopicChips(topic, profiles, 5),
    updatedAt: getUpdatedAt(topic),
    supportingTweets: selectSupportingTweets(topic.relatedTweets, profiles, { max: 3 }).map((tweet) => mapTweet(tweet, profiles)),
  }
}

function getDevelopingTopicCandidates(topics: AgendaTopicDetail[], limit: number, excludedIds = new Set<string>()) {
  const availableTopics = topics.filter((topic) => !excludedIds.has(topic.id))
  const primary = availableTopics.filter((topic) => (
    topic.needsConfirmation ||
    topic.signalCount === 1 ||
    topic.singleSourcePriority === "critical" ||
    topic.singleSourcePriority === "high" ||
    topic.storyStatus === "developing"
  ))

  if (primary.length >= limit) {
    return rankStoryTopics(primary).slice(0, limit)
  }

  const selected = new Map(primary.map((topic) => [topic.id, topic]))
  const fallback = availableTopics.filter((topic) => (
    !selected.has(topic.id) &&
    topic.agendaTier !== "routine" &&
    (
      topic.agendaTier === "watch" ||
      topic.agendaTier === "single_source" ||
      topic.freshnessScore >= 70 ||
      topic.momentumScore >= 40
    )
  ))

  for (const topic of rankStoryTopics(fallback)) {
    selected.set(topic.id, topic)
    if (selected.size >= limit) break
  }

  return rankStoryTopics([...selected.values()]).slice(0, limit)
}

function makeActorReactions(topics: AgendaTopicDetail[], profiles: Map<string, SourceProfile>): AppFeedActorReaction[] {
  const actorRoles = new Set<SourceRole>(["official", "journalist", "politician", "media", "local", "ngo", "expert"])

  return topics
    .filter((topic) => topic.relatedTweets.length >= 2)
    .map((topic) => {
      const reactions = selectSupportingTweets(topic.relatedTweets, profiles, {
        max: 5,
        allowedRoles: actorRoles,
      })
        .map((tweet) => mapTweet(tweet, profiles))
        .filter((tweet) => tweet.authorUsername)
        .slice(0, 5)
        .map((tweet) => ({
          ...tweet,
          actorName: tweet.authorDisplayName ?? tweet.authorUsername ?? "Kaynak",
          roleLabel: ROLE_LABELS[tweet.authorRole],
        }))

      return {
        storyId: topic.id,
        headline: cleanDisplayText(topic.title, 110),
        reactions,
      }
    })
    .filter((item) => item.reactions.length >= 2)
    .slice(0, 12)
}

function isLocalProfile(profile: SourceProfile | undefined) {
  if (!profile) return false
  const role = getSourceRole(profile)
  const category = normalizeLookup(profile.category ?? "")

  return role === "local" || category.includes("yerel") || category.includes("belediye") || category.includes("valilik")
}

function hasLocalEventLanguage(text: string) {
  return LOCAL_EVENT_TERMS.some((term) => includesTerm(text, term))
}

function hasMostlyNationalContext(text: string) {
  return NATIONAL_CONTEXT_TERMS.some((term) => includesTerm(text, term))
}

function findCityInText(text: string) {
  for (const item of CITY_ALIASES) {
    if (item.patterns.some((pattern) => includesTerm(text, pattern))) {
      return item.city
    }
  }

  return null
}

function detectLocalCity(topic: AgendaTopicDetail, profiles: Map<string, SourceProfile>) {
  const contentText = normalizeLookup([
    topic.title,
    topic.summary,
    topic.keywords.join(" "),
    ...topic.relatedTweets.slice(0, 5).map((tweet) => tweet.content),
  ].join(" "))

  const hasLocalSource = topic.relatedTweets.some((tweet) => isLocalProfile(profiles.get(sourceKey(tweet.authorUsername))))
  const contentCity = findCityInText(contentText)
  if (contentCity && !hasMostlyNationalContext(contentText) && (hasLocalEventLanguage(contentText) || hasLocalSource)) {
    return contentCity
  }

  const localAuthorText = normalizeLookup(topic.relatedTweets
    .filter((tweet) => isLocalProfile(profiles.get(sourceKey(tweet.authorUsername))))
    .slice(0, 5)
    .map((tweet) => `${tweet.authorUsername ?? ""} ${tweet.authorDisplayName ?? ""}`)
    .join(" "))
  if (hasLocalEventLanguage(contentText)) {
    return findCityInText(localAuthorText)
  }

  return null
}

function makeLocalAgenda(topics: AgendaTopicDetail[], profiles: Map<string, SourceProfile>): AppFeedLocalAgenda[] {
  const items: AppFeedLocalAgenda[] = []
  const seen = new Set<string>()

  for (const topic of topics) {
    const city = detectLocalCity(topic, profiles)
    if (!city || seen.has(`${city}:${topic.id}`)) continue

    seen.add(`${city}:${topic.id}`)
    items.push({
      city,
      storyId: topic.id,
      headline: cleanDisplayText(topic.title, 110),
      summary: cleanDisplayText(topic.summary, 220),
      topicChips: makeTopicChips(topic, profiles, 5),
      updatedAt: getUpdatedAt(topic),
      supportingTweets: selectSupportingTweets(topic.relatedTweets, profiles, { max: 3 }).map((tweet) => mapTweet(tweet, profiles)),
    })

    if (items.length >= 20) break
  }

  return items
}

async function getSourceProfiles() {
  const rows = await db.select({
    username: twitterAccounts.username,
    displayName: twitterAccounts.display_name,
    category: twitterAccounts.category,
    isOfficial: twitterAccounts.is_official,
    trustScore: twitterAccounts.trust_score,
  }).from(twitterAccounts)

  const profiles = new Map<string, SourceProfile>()
  for (const row of rows) {
    profiles.set(sourceKey(row.username), {
      username: row.username,
      displayName: row.displayName,
      category: row.category,
      isOfficial: row.isOfficial ?? false,
      trustScore: row.trustScore ?? 3,
    })
  }

  return profiles
}

async function getNewestTweetAt() {
  try {
    const rows = await db.all(sql`
      SELECT published_at AS published_at, fetched_at AS fetched_at
      FROM tweets_raw
      ORDER BY id DESC
      LIMIT 500
    `) as Array<{ published_at: string | null; fetched_at: string | null }>

    let newest: Date | null = null
    for (const row of rows) {
      for (const value of [row.published_at, row.fetched_at]) {
        if (!value) continue
        const parsed = new Date(value)
        if (Number.isNaN(parsed.getTime())) continue
        if (!newest || parsed.getTime() > newest.getTime()) {
          newest = parsed
        }
      }
    }

    return newest?.toISOString() ?? null
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes("tweets_raw")) {
      throw error
    }
  }

  const rows = await db.all(sql`
    SELECT tweeted_at
    FROM tr_tweets
    ORDER BY tweeted_at DESC
    LIMIT 1
  `) as Array<{ tweeted_at: number | null }>
  const tweetedAt = rows[0]?.tweeted_at

  return tweetedAt ? new Date(tweetedAt * 1000).toISOString() : null
}

function getDataFreshnessStatus(ageMinutes: number | null, totalTopics: number): DataFreshnessStatus {
  if (totalTopics === 0 || ageMinutes === null) return "empty"
  if (ageMinutes <= 90) return "fresh"
  if (ageMinutes <= 360) return "aging"
  return "stale"
}

function getDataHealthWarning(status: DataFreshnessStatus) {
  if (status === "fresh") return null
  if (status === "aging") return "Akışta veri var ama en yeni paylaşım birkaç saat geride olabilir."
  if (status === "stale") return "Akıştaki en yeni paylaşım eski görünüyor; veri çekme süreci kontrol edilmeli."
  return "Son 24 saat için gösterilecek gündem verisi bulunamadı."
}

function buildFacets(stories: AppFeedStory[]) {
  const storyTypeCounts = new Map<AppStoryType, number>()
  const chipCounts = new Map<string, { label: string; type: TopicChipType; count: number }>()

  for (const story of stories) {
    storyTypeCounts.set(story.storyType, (storyTypeCounts.get(story.storyType) ?? 0) + 1)

    for (const chip of story.topicChips) {
      const key = normalizeLookup(chip.label)
      const current = chipCounts.get(key) ?? { ...chip, count: 0 }
      current.count += 1
      if (chip.type === "place" || (chip.type === "hashtag" && current.type === "keyword")) {
        current.type = chip.type
        current.label = chip.label
      }
      chipCounts.set(key, current)
    }
  }

  return {
    storyTypes: [...storyTypeCounts.entries()]
      .map(([type, count]) => ({
        type,
        label: STORY_TYPE_LABELS[type],
        count,
      }))
      .sort((left, right) => right.count - left.count),
    topChips: [...chipCounts.values()]
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "tr"))
      .slice(0, 24),
  }
}

function getSharedChipScore(left: AppFeedTopicChip[], right: AppFeedTopicChip[]) {
  const leftKeys = new Set(left.map((chip) => normalizeLookup(chip.label)))
  return right.reduce((score, chip) => score + (leftKeys.has(normalizeLookup(chip.label)) ? 1 : 0), 0)
}

export async function buildAppFeed(options?: {
  topicLimit?: number
  latestLimit?: number
  developingLimit?: number
  mainStoryLimit?: number
  moreStoryLimit?: number
  quickBriefLimit?: number
}) {
  const topicLimit = options?.topicLimit ?? 180
  const latestLimit = options?.latestLimit ?? 40
  const developingLimit = options?.developingLimit ?? 24
  const mainStoryLimit = options?.mainStoryLimit ?? 12
  const moreStoryLimit = options?.moreStoryLimit ?? 28
  const quickBriefLimit = options?.quickBriefLimit ?? 30

  const [topics, profiles, newestTweetAt] = await Promise.all([
    getAgendaTopics(topicLimit, "all"),
    getSourceProfiles(),
    getNewestTweetAt(),
  ])
  const newestTweetAgeMinutes = minutesSince(newestTweetAt)
  const freshnessStatus = getDataFreshnessStatus(newestTweetAgeMinutes, topics.length)

  const nonRoutine = topics.filter((topic) => topic.agendaTier !== "routine")
  const storyCandidates = rankStoryTopics(nonRoutine.length > 0 ? nonRoutine : topics)
  const stories = storyCandidates.map((topic) => makeStory(topic, profiles))
  const mainStories = stories.slice(0, mainStoryLimit)
  const moreStories = stories.slice(mainStoryLimit, mainStoryLimit + moreStoryLimit)
  const todayAgendaIds = new Set([...mainStories, ...moreStories].map((story) => story.id))
  const quickBriefStart = mainStoryLimit + moreStoryLimit
  const quickBrief = stories.slice(quickBriefStart, quickBriefStart + quickBriefLimit).map((story) => ({
    id: story.id,
    headline: story.headline,
    summary: story.summary,
    badges: story.badges,
    topicChips: story.topicChips,
    updatedAt: story.updatedAt,
  }))

  const latestSignals = sortByNewest(topics)
    .slice(0, latestLimit)
    .map((topic) => makeLatestSignal(topic, profiles))

  const developingStories = getDevelopingTopicCandidates(topics, developingLimit, todayAgendaIds)
    .map((topic) => makeDevelopingStory(topic, profiles))

  const actorReactions = makeActorReactions(storyCandidates, profiles)
  const localAgenda = makeLocalAgenda(storyCandidates, profiles)
  const facets = buildFacets(stories)

  return {
    generatedAt: new Date().toISOString(),
    windowHours: 24,
    dataHealth: {
      status: freshnessStatus,
      newestTweetAt,
      newestTweetAgeMinutes,
      totalTopics: topics.length,
      activeSourceCount: profiles.size,
      warning: getDataHealthWarning(freshnessStatus),
    },
    todayAgenda: {
      title: "Bugünün Gündemi",
      lead: buildLead(mainStories),
      mainStories,
      moreStories,
      quickBrief,
    },
    latestSignals,
    actorReactions,
    developingStories,
    localAgenda,
    facets,
    counts: {
      totalTopics: topics.length,
      todayAgenda: mainStories.length + moreStories.length + quickBrief.length,
      latestSignals: latestSignals.length,
      actorReactions: actorReactions.length,
      developingStories: developingStories.length,
      localAgenda: localAgenda.length,
    },
  } satisfies AppFeed
}

function getAppFeedCacheKey(options?: {
  topicLimit?: number
  latestLimit?: number
  developingLimit?: number
  mainStoryLimit?: number
  moreStoryLimit?: number
  quickBriefLimit?: number
}) {
  return JSON.stringify({
    topicLimit: options?.topicLimit ?? 180,
    latestLimit: options?.latestLimit ?? 40,
    developingLimit: options?.developingLimit ?? 24,
    mainStoryLimit: options?.mainStoryLimit ?? 12,
    moreStoryLimit: options?.moreStoryLimit ?? 28,
    quickBriefLimit: options?.quickBriefLimit ?? 30,
  })
}

export async function getCachedAppFeed(options?: {
  topicLimit?: number
  latestLimit?: number
  developingLimit?: number
  mainStoryLimit?: number
  moreStoryLimit?: number
  quickBriefLimit?: number
  bypassCache?: boolean
}): Promise<{ feed: AppFeed; cache: AppFeedCacheMeta }> {
  const cacheKey = getAppFeedCacheKey(options)
  const now = Date.now()
  const cached = appFeedCache.get(cacheKey)
  const ttlSeconds = Math.round(APP_FEED_CACHE_TTL_MS / 1000)

  if (!options?.bypassCache && APP_FEED_CACHE_TTL_MS > 0 && cached && now - cached.cachedAt <= APP_FEED_CACHE_TTL_MS) {
    return {
      feed: cached.value,
      cache: {
        hit: true,
        key: cacheKey,
        ttlSeconds,
        cachedAt: new Date(cached.cachedAt).toISOString(),
      },
    }
  }

  const feed = await buildAppFeed(options)
  if (APP_FEED_CACHE_TTL_MS > 0) {
    appFeedCache.set(cacheKey, {
      value: feed,
      cachedAt: now,
    })
  }

  return {
    feed,
    cache: {
      hit: false,
      key: cacheKey,
      ttlSeconds,
      cachedAt: APP_FEED_CACHE_TTL_MS > 0 ? new Date(now).toISOString() : null,
    },
  }
}

export async function buildAppFeedStoryDetail(slug: string, options?: {
  relatedLimit?: number
  tweetLimit?: number
}) {
  const relatedLimit = options?.relatedLimit ?? 6
  const tweetLimit = options?.tweetLimit ?? 20

  const [topic, profiles] = await Promise.all([
    getAgendaTopicBySlug(slug),
    getSourceProfiles(),
  ])

  if (!topic) {
    return null
  }

  const story = makeStory(topic, profiles)
  const allTweets = selectSupportingTweets(topic.relatedTweets, profiles, { max: tweetLimit })
    .map((tweet) => mapTweet(tweet, profiles))
  const relatedTopics = await getAgendaTopics(120, "all")
  const relatedStories = rankStoryTopics(relatedTopics.filter((item) => item.id !== topic.id))
    .map((item) => ({
      topic: item,
      chips: makeTopicChips(item, profiles, 6),
    }))
    .map((item) => ({
      ...item,
      score: getSharedChipScore(story.topicChips, item.chips) + (item.topic.storyStatus === "developing" ? 1 : 0),
    }))
    .filter((item) => getSharedChipScore(story.topicChips, item.chips) > 0)
    .sort((left, right) => right.score - left.score || getTopicDisplayScore(right.topic) - getTopicDisplayScore(left.topic))
    .slice(0, relatedLimit)
    .map((item) => makeStoryPreview(item.topic, profiles))

  return {
    ...story,
    allTweets,
    relatedStories,
  } satisfies AppFeedStoryDetail
}
