import { NextResponse } from 'next/server'
import { getArchiveDigests } from '@/lib/digest-data'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
    const baseUrl = 'https://d4ily.com'

    let digests: Awaited<ReturnType<typeof getArchiveDigests>> = []

    try {
        digests = await getArchiveDigests()
    } catch (error) {
        digests = []
    }

    const feedItems = digests
        .filter(d => d.digest_date && d.title)
        .slice(0, 30) // Last 30 digests
        .map(digest => {
            const pubDate = new Date(digest.digest_date).toUTCString()
            const description = digest.intro || 'Günün özet haberleri'

            return `
    <item>
      <title><![CDATA[${digest.title}]]></title>
      <link>${baseUrl}/${digest.digest_date}</link>
      <guid isPermaLink="true">${baseUrl}/${digest.digest_date}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category>Gündem</category>
      ${digest.cover_image_url ? `<enclosure url="${digest.cover_image_url}" type="image/jpeg" />` : ''}
    </item>`
        })
        .join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>D4ily - Türkiye Gündem Özeti</title>
    <link>${baseUrl}</link>
    <description>Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 500+ tweet hesabı, 50+ haber kaynağı.</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icons/icon-512x512.jpg</url>
      <title>D4ily</title>
      <link>${baseUrl}</link>
      <width>512</width>
      <height>512</height>
    </image>
    <copyright>© ${new Date().getFullYear()} D4ily. Tüm hakları saklıdır.</copyright>
    <managingEditor>info@d4ily.com (D4ily)</managingEditor>
    <webMaster>info@d4ily.com (D4ily)</webMaster>
    <ttl>60</ttl>
    ${feedItems}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
