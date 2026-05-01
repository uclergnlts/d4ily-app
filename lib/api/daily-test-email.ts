import { getAgendaTopics, getMissedAgendaAlerts } from "@/lib/api/agenda"
import { getCoverageReport } from "@/lib/api/coverage"
import type { AgendaTopic } from "@/lib/api/agenda"

type SendEmailResult = {
  id?: string
  skipped?: boolean
  reason?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatDateTR() {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "full",
    timeZone: "Europe/Istanbul",
  }).format(new Date())
}

function buildSubject() {
  return `D4ily deneme gündemi - ${formatDateTR()}`
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const MAIL_STOPWORDS = new Set([
  "bugün",
  "bugun",
  "gündem",
  "gundem",
  "haber",
  "son",
  "yeni",
  "için",
  "icin",
  "olan",
  "dedi",
  "açıklama",
  "aciklama",
  "paylaşım",
  "paylasim",
])

function getMailTokens(topic: AgendaTopic) {
  const text = `${topic.title} ${topic.summary} ${topic.keywords.join(" ")}`
  return normalize(text)
    .split(" ")
    .filter((token) => token.length >= 4 && !MAIL_STOPWORDS.has(token))
    .slice(0, 18)
}

function overlapRatio(left: string[], right: Set<string>) {
  if (left.length === 0 || right.size === 0) return 0
  const matches = left.filter((token) => right.has(token)).length
  return matches / Math.min(left.length, right.size)
}

function cleanCutText(value: string, maxLength = 520) {
  const cleaned = value
    .replace(/[“”]/g, "\"")
    .replace(/Konu \d+ haber, \d+ sosyal sinyal, \d+ farklı kaynak ile destekleniyor.*?(öne çıkıyor|tutuluyor)\.?/giu, "")
    .replace(/Tek kaynaklı sinyal.*?(beklenmeli|tutuluyor)\.?/giu, "")
    .replace(/\s+/g, " ")
    .trim()

  if (cleaned.length <= maxLength) return cleaned

  const slice = cleaned.slice(0, maxLength)
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  )

  if (sentenceEnd >= 140) {
    return slice.slice(0, sentenceEnd + 1).trim()
  }

  const comma = Math.max(slice.lastIndexOf(", "), slice.lastIndexOf("; "))
  if (comma >= 180) {
    return `${slice.slice(0, comma).trim()}.`
  }

  const lastSpace = slice.lastIndexOf(" ")
  return `${slice.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}.`
}

function isTruncated(value: string) {
  const cleaned = value.trim()
  return cleaned.endsWith("...") || cleaned.endsWith("…") || cleaned.endsWith("…\"") || cleaned.endsWith("...'")
}

function isCeremonialTopic(topic: AgendaTopic) {
  const text = normalize(`${topic.title} ${topic.summary} ${topic.evidencePackage.topTweets.slice(0, 3).map((tweet) => tweet.content).join(" ")}`)
  const ceremonialPhrases = [
    "kutlu olsun",
    "tebrik ediyorum",
    "yil donumu",
    "yıldönümü",
    "yil dönümü",
    "kurulus yil",
    "kuruluş yıl",
    "yayinicilik birikimi",
    "yayincilik birikimi",
    "toplumsal hafizamiza",
    "toplumsal hafızamıza",
    "tatbikat",
    "gorusme",
    "görüşme",
    "ziyaret",
    "program",
    "afad baskanimiz",
    "afad başkanımız",
  ]

  const afadRoutine = text.includes("afad") && (
    text.includes("tatbikat") ||
    text.includes("goru") ||
    text.includes("program") ||
    text.includes("toplanti")
  )

  if (afadRoutine) return true
  return topic.signalType !== "breaking_event" && ceremonialPhrases.some((phrase) => text.includes(normalize(phrase)))
}

function isMailLeadWorthy(topic: AgendaTopic) {
  if (topic.isRoutine || topic.signalType === "routine_activity") return false
  if (isCeremonialTopic(topic)) return false
  if (topic.sourceCount >= 2 && topic.signalCount >= 2) return true
  if (topic.singleSourcePriority === "critical" || topic.singleSourcePriority === "high") return true
  return false
}

function buildReadableHeadline(topic: AgendaTopic) {
  const candidate = topic.newsFormat.headline || topic.title
  const cleaned = candidate
    .replace(/[❝❞]/g, "")
    .replace(/^["']+|["']+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
  const anlatttiIndex = cleaned.toLocaleLowerCase("tr-TR").indexOf("anlattı")
  if (anlatttiIndex >= 40 && anlatttiIndex <= 220) {
    return cleaned.slice(0, anlatttiIndex + "anlattı".length)
  }
  const naturalHeadline = cleaned.match(/^(.{40,220}?(açıklandı|duyurdu|tamamlandı|gerçekleştirildi|bulundu|oldu|etti))/iu)?.[1]
  if (naturalHeadline && !isTruncated(naturalHeadline)) {
    return naturalHeadline
  }

  if (!isTruncated(cleaned) && cleaned.length <= 240) {
    return cleaned
  }

  const articleTitle = topic.evidencePackage.topArticles[0]?.title
  if (articleTitle && !isTruncated(articleTitle) && articleTitle.length <= 260) {
    return cleanCutText(articleTitle, 250)
  }

  const firstTweet = topic.evidencePackage.topTweets.find((tweet) => !isTruncated(tweet.content))?.content
  if (firstTweet) {
    const cleanedTweet = firstTweet.replace(/[❝❞]/g, "").replace(/\s+/g, " ").trim()
    const tweetAnlattiIndex = cleanedTweet.toLocaleLowerCase("tr-TR").indexOf("anlattı")
    const tweetHeadline = tweetAnlattiIndex >= 40 && tweetAnlattiIndex <= 220
      ? cleanedTweet.slice(0, tweetAnlattiIndex + "anlattı".length)
      : null
    return tweetHeadline ?? cleanCutText(cleanedTweet, 230)
  }

  return cleanCutText(topic.summary.replace(/…/g, ""), 230)
}

function buildReadableSpot(topic: AgendaTopic) {
  const articleSummary = topic.evidencePackage.topArticles[0]?.summary
  const tweetContent = topic.evidencePackage.topTweets[0]?.content
  const candidates = [
    topic.newsFormat.body,
    topic.newsFormat.spot,
    articleSummary,
    tweetContent,
    topic.summary,
  ].filter((item): item is string => Boolean(item && item.trim().length > 0))

  const best = candidates
    .filter((item) => !isTruncated(item) || item.length > 220)
    .sort((left, right) => right.length - left.length)[0] ?? topic.summary.replace(/…/g, "")
  return cleanCutText(best, 620)
}

function selectMailTopics(topics: AgendaTopic[], limit: number) {
  const selected: AgendaTopic[] = []
  const selectedTokenSets: Array<Set<string>> = []
  const baseCandidates = topics
    .filter((topic) => topic.agendaTier !== "routine")
    .filter((topic) => {
      const headline = buildReadableHeadline(topic)
      const spot = buildReadableSpot(topic)
      return !isTruncated(headline) && !isTruncated(spot) && spot.length >= 80
    })
    .sort((left, right) => {
      const tierScore = (topic: AgendaTopic) => topic.agendaTier === "lead" ? 30 : topic.agendaTier === "major" ? 20 : topic.agendaTier === "watch" ? 10 : 0
      return (tierScore(right) + right.agendaScore + right.sourceCoverageScore) -
        (tierScore(left) + left.agendaScore + left.sourceCoverageScore)
    })
  const candidates = [
    ...baseCandidates.filter(isMailLeadWorthy),
    ...baseCandidates.filter((topic) => !isMailLeadWorthy(topic) && !isCeremonialTopic(topic) && topic.sourceCount >= 2),
  ]

  for (const topic of candidates) {
    const tokens = getMailTokens(topic)
    const isDuplicate = selectedTokenSets.some((existing) => overlapRatio(tokens, existing) >= 0.48)
    if (isDuplicate) continue

    selected.push(topic)
    selectedTokenSets.push(new Set(tokens))
    if (selected.length >= limit) break
  }

  return selected
}

function selectUniqueAlerts<T extends { title: string; summary: string }>(items: T[], limit: number) {
  const selected: T[] = []
  const tokenSets: Array<Set<string>> = []

  for (const item of items) {
    const tokens = normalize(`${item.title} ${item.summary}`)
      .split(" ")
      .filter((token) => token.length >= 4 && !MAIL_STOPWORDS.has(token))
    const duplicate = tokenSets.some((existing) => overlapRatio(tokens, existing) >= 0.5)
    if (duplicate) continue
    selected.push(item)
    tokenSets.push(new Set(tokens))
    if (selected.length >= limit) break
  }

  return selected
}

export async function buildDailyTestEmail() {
  const [topics, missedAlerts, coverage] = await Promise.all([
    getAgendaTopics(60, "all"),
    getMissedAgendaAlerts(20),
    getCoverageReport(),
  ])
  const leadTopics = selectMailTopics(topics, 8)
  const uniqueMissedAlerts = selectUniqueAlerts(missedAlerts, 6)
  const newestSignals = [...topics]
    .sort((left, right) => new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime() - new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime())
  const uniqueNewestSignals = selectMailTopics(newestSignals, 8)
  const subject = buildSubject()
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:720px;margin:0 auto;">
      <h1 style="font-size:24px;margin:0 0 8px;">Bugünün Gündemi</h1>
      <p style="margin:0 0 20px;color:#555;">${escapeHtml(formatDateTR())}</p>

      <h2 style="font-size:18px;margin:24px 0 12px;">Öne çıkanlar</h2>
      ${leadTopics.map((topic) => `
        <article style="border-top:1px solid #e5e5e5;padding:14px 0;">
          <h3 style="font-size:17px;margin:0 0 6px;">${escapeHtml(buildReadableHeadline(topic))}</h3>
          <p style="margin:0 0 8px;">${escapeHtml(buildReadableSpot(topic))}</p>
          <p style="margin:0;color:#666;font-size:13px;">${escapeHtml(topic.newsFormat.sourceLine)} Kaynak: ${topic.sourceCount}, tweet: ${topic.tweetCount}, skor: ${topic.agendaScore}</p>
        </article>
      `).join("") || "<p>Bugün için öne çıkan başlık henüz oluşmadı.</p>"}

      <h2 style="font-size:18px;margin:24px 0 12px;">Kaçmaması gereken sinyaller</h2>
      ${uniqueMissedAlerts.map((alert) => `
        <article style="border-top:1px solid #e5e5e5;padding:12px 0;">
          <h3 style="font-size:16px;margin:0 0 6px;">${escapeHtml(cleanCutText(alert.title, 140))}</h3>
          <p style="margin:0 0 6px;">${escapeHtml(cleanCutText(alert.summary, 360))}</p>
          <p style="margin:0;color:#666;font-size:13px;">${escapeHtml(alert.reason)}</p>
        </article>
      `).join("") || "<p>Şu an ayrıca alarm üreten tekil sinyal yok.</p>"}

      <h2 style="font-size:18px;margin:24px 0 12px;">Yeni düşenler</h2>
      <ul style="padding-left:20px;">
        ${uniqueNewestSignals.map((topic) => `<li style="margin:0 0 8px;">${escapeHtml(buildReadableHeadline(topic))}</li>`).join("")}
      </ul>

      <h2 style="font-size:18px;margin:24px 0 12px;">Sistem sağlığı</h2>
      <p style="margin:0;color:#555;">
        Aktif X hesabı: ${coverage.summary.activeTwitterAccounts}.
        Son 24 saatte tweet görülen hesap: ${coverage.summary.accountsWithTweets24h}.
        Kaynak kapsama skoru: ${coverage.summary.sourceCoverageScore}.
        Taranması geciken hesap: ${coverage.summary.notScannedWithin24h}.
      </p>
    </div>
  `
  const text = [
    `Bugünün Gündemi - ${formatDateTR()}`,
    "",
    "Öne çıkanlar:",
    ...leadTopics.map((topic, index) => `${index + 1}. ${buildReadableHeadline(topic)}\n${buildReadableSpot(topic)}\n${topic.newsFormat.sourceLine}`),
    "",
    "Kaçmaması gereken sinyaller:",
    ...uniqueMissedAlerts.map((alert, index) => `${index + 1}. ${cleanCutText(alert.title, 140)}\n${cleanCutText(alert.summary, 360)}\n${alert.reason}`),
    "",
    "Sistem sağlığı:",
    `Aktif X hesabı: ${coverage.summary.activeTwitterAccounts}`,
    `Son 24 saatte tweet görülen hesap: ${coverage.summary.accountsWithTweets24h}`,
    `Kaynak kapsama skoru: ${coverage.summary.sourceCoverageScore}`,
    `Taranması geciken hesap: ${coverage.summary.notScannedWithin24h}`,
  ].join("\n")

  return {
    subject,
    html,
    text,
    counts: {
      topics: topics.length,
      leadTopics: leadTopics.length,
      missedAlerts: uniqueMissedAlerts.length,
      newestSignals: uniqueNewestSignals.length,
      rawMissedAlerts: missedAlerts.length,
    },
  }
}

export async function sendDailyTestEmail(): Promise<SendEmailResult & { to?: string; subject?: string; counts?: unknown }> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.DAILY_TEST_EMAIL_TO
  const from = process.env.EMAIL_FROM || "D4ily <onboarding@resend.dev>"

  if (!apiKey || !to) {
    return {
      skipped: true,
      reason: "RESEND_API_KEY and DAILY_TEST_EMAIL_TO must be set",
    }
  }

  const email = await buildDailyTestEmail()
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((item) => item.trim()).filter(Boolean),
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Resend email failed (${response.status}): ${JSON.stringify(data)}`)
  }

  return {
    id: data.id,
    to,
    subject: email.subject,
    counts: email.counts,
  }
}
