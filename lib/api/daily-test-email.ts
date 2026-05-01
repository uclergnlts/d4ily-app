import { getAgendaTopics, getMissedAgendaAlerts } from "@/lib/api/agenda"
import { getCoverageReport } from "@/lib/api/coverage"

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

export async function buildDailyTestEmail() {
  const [topics, missedAlerts, coverage] = await Promise.all([
    getAgendaTopics(60, "all"),
    getMissedAgendaAlerts(20),
    getCoverageReport(),
  ])
  const leadTopics = topics
    .filter((topic) => topic.agendaTier !== "routine")
    .slice(0, 12)
  const newestSignals = [...topics]
    .sort((left, right) => new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime() - new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime())
    .slice(0, 10)
  const subject = buildSubject()
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:720px;margin:0 auto;">
      <h1 style="font-size:24px;margin:0 0 8px;">Bugünün Gündemi</h1>
      <p style="margin:0 0 20px;color:#555;">${escapeHtml(formatDateTR())}</p>

      <h2 style="font-size:18px;margin:24px 0 12px;">Öne çıkanlar</h2>
      ${leadTopics.map((topic) => `
        <article style="border-top:1px solid #e5e5e5;padding:14px 0;">
          <h3 style="font-size:17px;margin:0 0 6px;">${escapeHtml(topic.newsFormat.headline)}</h3>
          <p style="margin:0 0 8px;">${escapeHtml(topic.newsFormat.spot)}</p>
          <p style="margin:0;color:#666;font-size:13px;">${escapeHtml(topic.newsFormat.sourceLine)} Kaynak: ${topic.sourceCount}, tweet: ${topic.tweetCount}, skor: ${topic.agendaScore}</p>
        </article>
      `).join("") || "<p>Bugün için öne çıkan başlık henüz oluşmadı.</p>"}

      <h2 style="font-size:18px;margin:24px 0 12px;">Kaçmaması gereken sinyaller</h2>
      ${missedAlerts.slice(0, 8).map((alert) => `
        <article style="border-top:1px solid #e5e5e5;padding:12px 0;">
          <h3 style="font-size:16px;margin:0 0 6px;">${escapeHtml(alert.title)}</h3>
          <p style="margin:0 0 6px;">${escapeHtml(alert.summary)}</p>
          <p style="margin:0;color:#666;font-size:13px;">${escapeHtml(alert.reason)}</p>
        </article>
      `).join("") || "<p>Şu an ayrıca alarm üreten tekil sinyal yok.</p>"}

      <h2 style="font-size:18px;margin:24px 0 12px;">Yeni düşenler</h2>
      <ul style="padding-left:20px;">
        ${newestSignals.map((topic) => `<li style="margin:0 0 8px;">${escapeHtml(topic.title)}</li>`).join("")}
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
    ...leadTopics.map((topic, index) => `${index + 1}. ${topic.newsFormat.headline}\n${topic.newsFormat.spot}\n${topic.newsFormat.sourceLine}`),
    "",
    "Kaçmaması gereken sinyaller:",
    ...missedAlerts.slice(0, 8).map((alert, index) => `${index + 1}. ${alert.title}\n${alert.reason}`),
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
      missedAlerts: missedAlerts.length,
      newestSignals: newestSignals.length,
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
