import { getArchiveDigests } from "@/lib/digest-data"
import { NextResponse } from "next/server"

export const revalidate = 3600

export async function GET() {
  const digests = await getArchiveDigests()

  const items = digests
    .map((digest) => {
      const pubDate = new Date(digest.digest_date).toUTCString()
      const url = `https://d4ily.com/${digest.digest_date}`
      const audioUrl = digest.audio_url && digest.audio_url.startsWith("http") ? digest.audio_url : ""
      const duration = digest.audio_duration || 300
      const bitrate = 128000 // 128 kbps for MP3
      const fileLength = Math.floor((duration * bitrate) / 8)

      return `
      <item>
        <title>${escapeXml(digest.title || "Günlük Özet")}</title>
        <description>${escapeXml(digest.intro || "Türkiye gündem özeti")}</description>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${pubDate}</pubDate>
        ${
          audioUrl
            ? `
        <enclosure url="${audioUrl}" type="audio/mpeg" length="${fileLength}" />
        <itunes:duration>${formatDuration(duration)}</itunes:duration>
        <itunes:explicit>false</itunes:explicit>
        `
            : ""
        }
      </item>
    `
    })
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>D4ily - Türkiye Gündem Özeti</title>
    <link>https://d4ily.com</link>
    <description>Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 5 dakikada tüm önemli gelişmeler.</description>
    <language>tr</language>
    <copyright>© ${new Date().getFullYear()} D4ily</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://d4ily.com/rss.xml" rel="self" type="application/rss+xml" />
    
    <itunes:author>D4ily</itunes:author>
    <itunes:summary>Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 5 dakikada tüm önemli gelişmeler.</itunes:summary>
    <itunes:owner>
      <itunes:name>D4ily</itunes:name>
      <itunes:email>info@d4ily.com</itunes:email>
    </itunes:owner>
    <itunes:image href="https://d4ily.com/icons/icon-512x512.jpg" />
    <itunes:category text="News">
      <itunes:category text="Daily News" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`
}
