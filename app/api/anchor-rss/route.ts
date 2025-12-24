import { NextResponse } from "next/server"

export const revalidate = 300 // 5 dakika cache

export const dynamic = "force-dynamic" // Her istekte yeni veri cek

const RSS_FEED_URL = "https://anchor.fm/s/10cceac40/podcast/rss"

interface PodcastEpisode {
  title: string
  audioUrl: string
  pubDate: string
  description: string
  duration?: string
  image?: string
}

interface PodcastChannel {
  title: string
  image?: string
}

function parseXMLDate(dateStr: string): Date {
  return new Date(dateStr)
}

function extractDateFromTitle(title: string): string | null {
  const dateMatch = title.match(/(\d{1,2})[\s\-./](\d{1,2})[\s\-./](\d{4})/)
  if (dateMatch) {
    const [, day, month, year] = dateMatch
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  const isoMatch = title.match(/(\d{4})[\s-](\d{1,2})[\s-](\d{1,2})/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
  }

  return null
}

async function parseRSSFeed(): Promise<{ episodes: PodcastEpisode[]; channel: PodcastChannel }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(RSS_FEED_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; D4ilyBot/1.0)",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 300 },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const xmlText = await response.text()

    const channelTitleMatch = xmlText.match(/<channel>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>/)
    const channelImageMatch = xmlText.match(/<itunes:image\s+href="([^"]+)"/)
    const channelImageAlt = xmlText.match(/<image>[\s\S]*?<url>([^<]+)<\/url>/)

    const channel: PodcastChannel = {
      title: channelTitleMatch ? channelTitleMatch[1] : "D4ily Popcast",
      image: channelImageMatch ? channelImageMatch[1] : channelImageAlt ? channelImageAlt[1] : undefined,
    }

    const episodes: PodcastEpisode[] = []
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g)

    for (const match of itemMatches) {
      const itemContent = match[1]

      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const enclosureMatch = itemContent.match(/<enclosure url="(.*?)"/)
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)
      const durationMatch = itemContent.match(/<itunes:duration>(.*?)<\/itunes:duration>/)
      const episodeImageMatch = itemContent.match(/<itunes:image\s+href="([^"]+)"/)

      if (titleMatch && enclosureMatch && pubDateMatch) {
        episodes.push({
          title: titleMatch[1],
          audioUrl: enclosureMatch[1],
          pubDate: pubDateMatch[1],
          description: descriptionMatch ? descriptionMatch[1] : "",
          duration: durationMatch ? durationMatch[1] : undefined,
          image: episodeImageMatch ? episodeImageMatch[1] : channel.image,
        })
      }
    }

    return { episodes, channel }
  } catch (error) {
    return { episodes: [], channel: { title: "D4ily Popcast" } }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let date = searchParams.get("date")

  if (date) {
    date = date.split(":")[0].split("?")[0].trim()
  }

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  const { episodes, channel } = await parseRSSFeed()

  if (episodes.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "RSS feed could not be fetched",
        channel,
      },
      { status: 503 },
    )
  }

  const matchingEpisode = episodes.find((episode) => {
    const episodeDate = extractDateFromTitle(episode.title)
    if (episodeDate === date) return true

    const pubDate = parseXMLDate(episode.pubDate)
    const targetDate = new Date(date)
    return (
      pubDate.getFullYear() === targetDate.getFullYear() &&
      pubDate.getMonth() === targetDate.getMonth() &&
      pubDate.getDate() === targetDate.getDate()
    )
  })

  if (matchingEpisode) {
    return NextResponse.json({
      success: true,
      episode: matchingEpisode,
      channel,
    })
  }

  return NextResponse.json(
    {
      success: false,
      message: "No matching episode found for this date",
      channel,
    },
    { status: 404 },
  )
}
