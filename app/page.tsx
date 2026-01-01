import { Header } from "@/components/header"
import { MarketTicker } from "@/components/market-ticker"
import { WelcomeSection } from "@/components/welcome-section"
import { TrendingTopicsCircles } from "@/components/trending-topics-circles"
import { NewsGrid } from "@/components/news-grid"
import { EditorPick } from "@/components/editor-pick"
import { PodcastSimple } from "@/components/podcast-simple"
import { ArchiveSection } from "@/components/archive-section"
import { EditorArticles } from "@/components/editor-articles"
import { Newsletter } from "@/components/newsletter"
import Footer from "@/components/footer"
import { ResmiGazeteTicker } from "@/components/resmi-gazete-ticker"

import { getMarketData } from "@/lib/services/market"
import { getOfficialGazetteSummary } from "@/lib/services/official-gazette"
import { getArchiveDigests, getLatestWeeklyDigest } from "@/lib/digest-data"
import { getLatestNews, getLatestArticles } from "@/lib/services/news"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  let marketData = null
  let gazetteData = null

  // Explicitly typing or initializing as empty arrays of correct type would be best, 
  // but for quick fix avoiding import complexity 'any' is okay if strictly typed in components.
  // Ideally: let digests: Digest[] = []; let news: NewsItem[] = [];
  let digests: any[] = []
  let news: any[] = []
  let editorArticles: any[] = []
  let weeklyDigest = null

  try {
    const [marketRes, gazetteRes, digestsRes, newsRes, articlesRes, weeklyRes] = await Promise.allSettled([
      getMarketData(),
      getOfficialGazetteSummary(),
      getArchiveDigests(),
      getLatestNews(8), // Fetch 8 news for grid (filtered)
      getLatestArticles(3), // Fetch 3 articles for editor section
      getLatestWeeklyDigest()
    ])

    if (marketRes.status === 'fulfilled') marketData = marketRes.value
    if (gazetteRes.status === 'fulfilled') gazetteData = gazetteRes.value
    if (digestsRes.status === 'fulfilled') digests = digestsRes.value
    if (newsRes.status === 'fulfilled') news = newsRes.value
    if (articlesRes.status === 'fulfilled') editorArticles = articlesRes.value
    if (weeklyRes.status === 'fulfilled') weeklyDigest = weeklyRes.value

  } catch (error) {
    console.error("Failed to fetch homepage data:", error)
  }

  // News and Articles are already separated by the API calls
  const gridNews = news
  const editorNews = editorArticles

  return (
    <div className="min-h-screen">
      <MarketTicker data={marketData} />
      <Header />
      <ResmiGazeteTicker summary={gazetteData?.summary_markdown || null} />
      <main role="main" aria-label="Ana içerik">
        <WelcomeSection />
        <TrendingTopicsCircles digests={digests} />
        <NewsGrid news={gridNews} />
        <EditorPick digest={weeklyDigest} />
        <PodcastSimple digest={digests[0]} />
        <ArchiveSection digests={digests.slice(1)} />
        <EditorArticles articles={editorNews} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
