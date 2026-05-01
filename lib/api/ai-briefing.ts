import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"

import type { AgendaTopicDetail } from "@/lib/api/agenda"

type CoverageSummary = {
  activeTwitterAccounts: number
  accountsWithTweets24h: number
  zeroTweetAccounts24h: number
  neverFetchedAccounts: number
  dueAccounts: number
}

export type AiBriefing = {
  generatedAt: string
  provider: "openai" | "gemini" | "fallback"
  model: string
  windowHours: number
  headline: string
  executiveSummary: string
  keyDevelopments: Array<{
    title: string
    summary: string
    signalType: string
    confidenceLevel: string
    sourceCount: number
    signalCount: number
    whyItMatters: string
  }>
  singleSourceAlerts: Array<{
    title: string
    source: string | null
    signalType: string
    confidenceLevel: string
    singleSourcePriority: string
    whyWatch: string
  }>
  watchlist: string[]
  coverageNote: string
  editorialNotes: string[]
  newsStories: Array<{
    headline: string
    spot: string
    body: string
    category: string
    status: "confirmed" | "developing" | "needs_confirmation"
    sourceStrength: string
    qualityScore: number
    readTimeSeconds: number
    relatedSignals: number
    whatWeKnow: string[]
    whatNeedsConfirmation: string[]
    evidence: Array<{
      source: string | null
      text: string
      url: string | null
      publishedAt: string | null
    }>
  }>
}

type BriefingInput = {
  topics: AgendaTopicDetail[]
  coverageSummary: CoverageSummary
}

type BriefingOptions = {
  timeoutMs?: number
}

const DEFAULT_AI_TIMEOUT_MS = 25_000

const briefingSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    executiveSummary: { type: "string" },
    keyDevelopments: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          signalType: { type: "string" },
          confidenceLevel: { type: "string" },
          sourceCount: { type: "number" },
          signalCount: { type: "number" },
          whyItMatters: { type: "string" },
        },
        required: ["title", "summary", "signalType", "confidenceLevel", "sourceCount", "signalCount", "whyItMatters"],
      },
    },
    singleSourceAlerts: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          source: { type: ["string", "null"] },
          signalType: { type: "string" },
          confidenceLevel: { type: "string" },
          singleSourcePriority: { type: "string" },
          whyWatch: { type: "string" },
        },
        required: ["title", "source", "signalType", "confidenceLevel", "singleSourcePriority", "whyWatch"],
      },
    },
    watchlist: {
      type: "array",
      maxItems: 8,
      items: { type: "string" },
    },
    coverageNote: { type: "string" },
    editorialNotes: {
      type: "array",
      maxItems: 6,
      items: { type: "string" },
    },
    newsStories: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          headline: { type: "string" },
          spot: { type: "string" },
          body: { type: "string" },
          category: { type: "string" },
          status: { type: "string", enum: ["confirmed", "developing", "needs_confirmation"] },
          sourceStrength: { type: "string" },
          qualityScore: { type: "number" },
          readTimeSeconds: { type: "number" },
          relatedSignals: { type: "number" },
          whatWeKnow: {
            type: "array",
            maxItems: 4,
            items: { type: "string" },
          },
          whatNeedsConfirmation: {
            type: "array",
            maxItems: 4,
            items: { type: "string" },
          },
          evidence: {
            type: "array",
            maxItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                source: { type: ["string", "null"] },
                text: { type: "string" },
                url: { type: ["string", "null"] },
                publishedAt: { type: ["string", "null"] },
              },
              required: ["source", "text", "url", "publishedAt"],
            },
          },
        },
        required: [
          "headline",
          "spot",
          "body",
          "category",
          "status",
          "sourceStrength",
          "qualityScore",
          "readTimeSeconds",
          "relatedSignals",
          "whatWeKnow",
          "whatNeedsConfirmation",
          "evidence",
        ],
      },
    },
  },
  required: ["headline", "executiveSummary", "keyDevelopments", "singleSourceAlerts", "watchlist", "coverageNote", "editorialNotes", "newsStories"],
}

function cleanText(value: string, maxLength: number) {
  const cleaned = value.replace(/\s+/g, " ").trim()
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength).trim()}...` : cleaned
}

function getRepresentativeSource(topic: AgendaTopicDetail) {
  return topic.representativeSignals[0]?.sourceName ?? topic.relatedTweets[0]?.authorUsername ?? null
}

function getQualityScore(topic: AgendaTopicDetail) {
  const sourceScore = Math.min(topic.sourceCount * 12, 36)
  const signalScore = Math.min(topic.signalCount * 6, 24)
  const officialScore = topic.officialSourceCount > 0 ? 20 : 0
  const confidenceScore = topic.confidenceLevel === "high" ? 20 : topic.confidenceLevel === "medium" ? 10 : 0
  const confirmationPenalty = topic.needsConfirmation ? 18 : 0
  const routinePenalty = topic.isRoutine ? 8 : 0

  return Math.max(0, Math.min(100, sourceScore + signalScore + officialScore + confidenceScore - confirmationPenalty - routinePenalty))
}

function getSourceStrength(topic: AgendaTopicDetail) {
  if (topic.officialSourceCount > 0 && topic.sourceCount >= 2) return "resmi kaynaklarla destekli"
  if (topic.sourceCount >= 5) return "çok kaynaklı"
  if (topic.sourceCount >= 2) return "birden fazla kaynaklı"
  return "tek kaynaklı"
}

const singleSourcePriorityRank = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

function sortSingleSourceTopics(topics: AgendaTopicDetail[]) {
  return [...topics].sort((left, right) => {
    const priorityDiff = singleSourcePriorityRank[right.singleSourcePriority] - singleSourcePriorityRank[left.singleSourcePriority]
    if (priorityDiff !== 0) return priorityDiff
    return right.agendaScore - left.agendaScore
  })
}

function getEvidence(topic: AgendaTopicDetail) {
  const tweets = topic.relatedTweets.slice(0, 4).map((tweet) => ({
    source: tweet.authorUsername,
    text: cleanText(tweet.content, 220),
    url: tweet.tweetUrl,
    publishedAt: tweet.publishedAt,
  }))
  const articles = topic.relatedArticles.slice(0, Math.max(0, 4 - tweets.length)).map((article) => ({
    source: article.sourceName,
    text: cleanText(article.title || article.summary, 220),
    url: article.url ?? null,
    publishedAt: article.publishedAt,
  }))

  return [...tweets, ...articles]
}

function compactTopic(topic: AgendaTopicDetail) {
  return {
    title: cleanText(topic.title, 180),
    summary: cleanText(topic.summary, 260),
    signalType: topic.signalType,
    confidenceLevel: topic.confidenceLevel,
    needsConfirmation: topic.needsConfirmation,
    isRoutine: topic.isRoutine,
    agendaScore: topic.agendaScore,
    agendaTier: topic.agendaTier,
    storyStatus: topic.storyStatus,
    singleSourcePriority: topic.singleSourcePriority,
    singleSourceReason: topic.singleSourceReason,
    freshnessScore: topic.freshnessScore,
    sourceDiversityScore: topic.sourceDiversityScore,
    publicImpactScore: topic.publicImpactScore,
    momentumScore: topic.momentumScore,
    signalCount: topic.signalCount,
    sourceCount: topic.sourceCount,
    officialSourceCount: topic.officialSourceCount,
    firstSeenAt: topic.firstSeenAt,
    lastUpdatedAt: topic.lastUpdatedAt,
    source: getRepresentativeSource(topic),
    detectionReason: topic.detectionReason,
    qualityScore: getQualityScore(topic),
    sourceStrength: getSourceStrength(topic),
    evidence: getEvidence(topic),
    whatWeKnowSeed: [
      `${topic.signalCount} sinyal, ${topic.sourceCount} kaynak.`,
      topic.officialSourceCount > 0 ? `${topic.officialSourceCount} resmi/birincil kaynak sinyali var.` : "Resmi kaynak sinyali görünmüyor.",
      topic.needsConfirmation ? "Teyit ihtiyacı var." : "Birden fazla sinyal veya güçlü kaynak desteği var.",
    ],
  }
}

function extractJson(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  return start >= 0 && end >= start ? trimmed.slice(start, end + 1) : trimmed
}

function buildPrompt(input: BriefingInput) {
  const topics = input.topics.slice(0, 80).map(compactTopic)
  const singleSource = input.topics
    .filter((topic) => topic.signalCount === 1 || topic.needsConfirmation)
    .sort((left, right) => singleSourcePriorityRank[right.singleSourcePriority] - singleSourcePriorityRank[left.singleSourcePriority] || right.agendaScore - left.agendaScore)
    .slice(0, 30)
    .map(compactTopic)

  return `
Sen D4ily için Türkçe çalışan kıdemli gündem editörüsün.

Görevin:
- Son 24 saatte X hesaplarından yakalanan sinyalleri anlamlandır.
- Kullanıcıya rapor değil, okunabilir haber akışı üret.
- Her önemli gündemi kısa haber diliyle anlat: başlık, spot ve 2-3 cümlelik gövde.
- Hiçbir tek kaynaklı sinyali önemsiz diye yok sayma.
- Çok kaynaklı güçlü gündemleri ayrı, tek kaynaklı teyit bekleyenleri ayrı anlat.
- Spekülasyon yapma. Veride olmayan kişi, tarih, sayı veya iddia ekleme.
- "Kesin" deme; confidenceLevel ve sourceCount'a saygı göster.
- Kullanıcıya signalType, confidenceLevel, sourceCount gibi teknik alanları metnin içinde söyleme; bunları sadece JSON alanlarında taşı.
- Üslup: sade, hızlı anlaşılır, haber dili. Abartı, yorum ve siyasi tarafgirlik yok.
- newsStories alanı son kullanıcıya gösterilecek ana üründür.
- Her newsStories öğesi sadece verilen evidence alanındaki bilgilere dayanmalı.
- whatWeKnow alanına kanıta dayalı net maddeler yaz.
- whatNeedsConfirmation alanına özellikle tek kaynaklı veya düşük güvenli konularda eksik teyitleri yaz; güçlü konularda boş dizi olabilir.
- qualityScore değerini inputtaki kalite sinyalini dikkate alarak 0-100 arası ver; yüksek kaynak çeşitliliği ve resmi kaynaklar puanı yükseltir, tek kaynaklılık düşürür.
- agendaScore, agendaTier, freshnessScore, sourceDiversityScore, publicImpactScore ve momentumScore alanlarını haber seçimi için kullan.
- lead veya major tier başlıkları ana haberleştir; single_source tier başlıkları ana haber yerine singleSourceAlerts/watchlist tarafında görünür tut.
- singleSourcePriority critical/high ise tek kaynaklı olsa bile görünürlüğünü artır; bunu singleSourceAlerts içinde ilk sıralara taşı.
- sourceStrength kullanıcıya anlaşılır yazı olmalı: "tek kaynaklı", "birden fazla kaynaklı", "çok kaynaklı", "resmi kaynaklarla destekli" gibi.
- Body alanında teknik terimler, sinyal sayısı veya kaynak sayısı anlatma; bunlar JSON metadatasında kalmalı.
- Çıktı sadece JSON olmalı.

Coverage:
${JSON.stringify(input.coverageSummary)}

Güçlü/öne çıkan sinyaller:
${JSON.stringify(topics)}

Tek kaynaklı veya teyit isteyen sinyaller:
${JSON.stringify(singleSource)}
`
}

function fallbackBriefing(input: BriefingInput): AiBriefing {
  const keyDevelopments = input.topics
    .filter((topic) => topic.sourceCount >= 2 || topic.confidenceLevel === "high")
    .slice(0, 8)
    .map((topic) => ({
      title: topic.title,
      summary: cleanText(topic.summary, 240),
      signalType: topic.signalType,
      confidenceLevel: topic.confidenceLevel,
      sourceCount: topic.sourceCount,
      signalCount: topic.signalCount,
      whyItMatters: `${topic.signalCount} sinyal ve ${topic.sourceCount} kaynakla destekleniyor.`,
    }))

  const singleSourceAlerts = sortSingleSourceTopics(
    input.topics.filter((topic) => topic.signalCount === 1 || topic.needsConfirmation),
  )
    .slice(0, 8)
    .map((topic) => ({
      title: topic.title,
      source: getRepresentativeSource(topic),
      signalType: topic.signalType,
      confidenceLevel: topic.confidenceLevel,
      singleSourcePriority: topic.singleSourcePriority,
      whyWatch: topic.singleSourceReason ?? (
        topic.needsConfirmation
          ? "Tekil veya düşük güvenli sinyal; ikinci kaynak ve resmi teyit beklenmeli."
          : "Tek kaynaklı sinyal olduğu için görünür tutulmalı."
      ),
    }))
  const newsStories = input.topics.slice(0, 10).map((topic) => ({
    evidence: getEvidence(topic),
    headline: topic.title,
    spot: cleanText(topic.summary, 180),
    body: cleanText(`${topic.summary} ${topic.detectionReason}`, 420),
    category: topic.signalType,
    status: topic.needsConfirmation ? "needs_confirmation" as const : topic.confidenceLevel === "high" ? "confirmed" as const : "developing" as const,
    sourceStrength: getSourceStrength(topic),
    qualityScore: getQualityScore(topic),
    readTimeSeconds: 25,
    relatedSignals: topic.signalCount,
    whatWeKnow: [
      `${topic.signalCount} sinyal ve ${topic.sourceCount} kaynakla yakalandı.`,
      topic.officialSourceCount > 0 ? "Resmi veya birincil kaynak sinyali var." : "Resmi kaynak sinyali görünmüyor.",
    ],
    whatNeedsConfirmation: topic.needsConfirmation ? ["İkinci kaynak veya resmi açıklama beklenmeli."] : [],
  }))

  return {
    generatedAt: new Date().toISOString(),
    provider: "fallback",
    model: "deterministic",
    windowHours: 24,
    headline: keyDevelopments[0]?.title ?? "Son 24 saatin X sinyalleri",
    executiveSummary: `Son 24 saatte ${input.topics.length} gündem sinyali paketlendi. ${input.coverageSummary.accountsWithTweets24h} aktif kaynakta paylaşım görüldü.`,
    keyDevelopments,
    singleSourceAlerts,
    watchlist: singleSourceAlerts.map((item) => item.title).slice(0, 6),
    coverageNote: `${input.coverageSummary.activeTwitterAccounts} aktif X hesabının ${input.coverageSummary.accountsWithTweets24h} tanesinde son 24 saatte tweet görüldü; ${input.coverageSummary.dueAccounts} hesap yeniden taranmayı bekliyor.`,
    editorialNotes: [
      "AI anahtarı bulunmadığı için deterministik fallback üretildi.",
      "Bu çıktı veriyi elemez; tek kaynaklı sinyaller ayrıca görünür tutulur.",
    ],
    newsStories,
  }
}

function completeBriefing(data: Omit<AiBriefing, "generatedAt" | "provider" | "model" | "windowHours">, provider: "openai" | "gemini", model: string): AiBriefing {
  return {
    generatedAt: new Date().toISOString(),
    provider,
    model,
    windowHours: 24,
    headline: data.headline,
    executiveSummary: data.executiveSummary,
    keyDevelopments: data.keyDevelopments ?? [],
    singleSourceAlerts: data.singleSourceAlerts ?? [],
    watchlist: data.watchlist ?? [],
    coverageNote: data.coverageNote,
    editorialNotes: data.editorialNotes ?? [],
    newsStories: data.newsStories ?? [],
  }
}

function logAiError(provider: string, error: unknown) {
  const details = error && typeof error === "object"
    ? error as { status?: unknown; code?: unknown; type?: unknown; message?: unknown }
    : null

  console.error(`${provider} briefing generation failed:`, {
    status: details?.status,
    code: details?.code,
    type: details?.type,
    message: details?.message ?? String(error),
  })
}

function getAiTimeoutMs(options?: BriefingOptions) {
  const configured = Number(process.env.AI_BRIEFING_TIMEOUT_MS)
  if (options?.timeoutMs !== undefined) return options.timeoutMs
  if (Number.isFinite(configured) && configured > 0) return configured
  return DEFAULT_AI_TIMEOUT_MS
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  if (timeoutMs <= 0) return promise

  let timeout: ReturnType<typeof setTimeout> | null = null
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

async function generateWithOpenAI(input: BriefingInput) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const model = process.env.AI_MODEL || "gpt-4.1-mini"
  const client = new OpenAI({ apiKey })
  const response = await client.responses.create({
    model,
    input: buildPrompt(input),
    text: {
      format: {
        type: "json_schema",
        name: "d4ily_ai_briefing",
        schema: briefingSchema,
        strict: true,
      },
    },
  })

  return completeBriefing(JSON.parse(response.output_text), "openai", model)
}

async function generateWithGemini(input: BriefingInput) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return null

  const model = process.env.AI_MODEL || "gemini-2.0-flash"
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      responseMimeType: "application/json",
    },
  })
  const result = await geminiModel.generateContent(buildPrompt(input))
  const text = result.response.text()

  return completeBriefing(JSON.parse(extractJson(text)), "gemini", model)
}

export async function generateAiBriefing(input: BriefingInput, options?: BriefingOptions): Promise<AiBriefing> {
  const timeoutMs = getAiTimeoutMs(options)

  try {
    const openAiResult = await withTimeout(generateWithOpenAI(input), timeoutMs, "OpenAI briefing generation")
    if (openAiResult) return openAiResult
  } catch (error) {
    logAiError("OpenAI", error)
  }

  try {
    const geminiResult = await withTimeout(generateWithGemini(input), timeoutMs, "Gemini briefing generation")
    if (geminiResult) return geminiResult
  } catch (error) {
    logAiError("Gemini", error)
  }

  return fallbackBriefing(input)
}
