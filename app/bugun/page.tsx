import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import DigestCard from "@/components/digest-card"
import AudioSummary from "@/components/audio-summary"
import ImportantTweets from "@/components/important-tweets"
import { SectionDivider } from "@/components/section-divider"
import { ReadingProgress } from "@/components/reading-progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import DayNavigation from "@/components/day-navigation"
import ReactionButtons from "@/components/reaction-buttons"
import NewsletterPopup from "@/components/newsletter-popup"
import {
  getTodayDigest,
  getImportantTweets,
  getTopTweetsByDate,
  getTodayDate,
} from "@/lib/digest-data"
import Image from "next/image"
import { NewsTimeline, type TimelineEvent } from "@/components/news-timeline"
import { Share2 } from "lucide-react"
import Link from "next/link"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const digest = await getTodayDigest()

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const title = digest?.title ? `${digest.title} - ${today}` : `Bugünün Özeti - ${today}`

  const description = digest?.intro
    ? digest.intro.slice(0, 160)
    : `${today} tarihli Türkiye gündem özeti. Günün önemli gelişmeleri, en çok konuşulan konular ve önemli tweetler.`

  const ogImage = digest?.cover_image_url || "/og-image.jpg"

  return {
    title,
    description,
    alternates: {
      canonical: "https://d4ily.com/bugun",
    },
    openGraph: {
      title,
      description,
      url: "https://d4ily.com/bugun",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function BugunPage() {
  const digest = await getTodayDigest()
  const tweetDate = digest?.digest_date || getTodayDate()

  const tweetsForDay = await getTopTweetsByDate(tweetDate, 20)
  const tweets = tweetsForDay.length > 0 ? tweetsForDay : await getImportantTweets()

  if (!digest) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <div className="text-center">
            <h1 className="mb-4 font-display text-3xl font-bold">Henüz özet yok</h1>
            <p className="text-muted-foreground">Bugünün özeti henüz hazırlanmadı. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formattedDate = new Date(digest.digest_date).toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: digest.title || "Türkiye Gündem Özeti",
    description: digest.intro || "Günlük Türkiye gündem özeti",
    image: digest.cover_image_url || "https://d4ily.com/og-image.jpg",
    datePublished: digest.digest_date,
    dateModified: digest.digest_date,
    author: {
      "@type": "Organization",
      name: "D4ily",
      url: "https://d4ily.com",
    },
    publisher: {
      "@type": "Organization",
      name: "D4ily",
      logo: {
        "@type": "ImageObject",
        url: "https://d4ily.com/icons/icon-512x512.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://d4ily.com/bugun",
    },
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://d4ily.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bugün",
        item: "https://d4ily.com/bugun",
      },
    ],
  }

  const timelineEvents: TimelineEvent[] = []
  if (digest && digest.content) {
    const lines = digest.content.split("\n").filter((line) => line.trim())
    let currentTime = "09:00"

    for (const line of lines) {
      if (line.startsWith("###") || line.startsWith("##")) {
        const title = line.replace(/^#+\s*/, "").trim()
        if (title) {
          const nextLines = lines.slice(lines.indexOf(line) + 1, lines.indexOf(line) + 4)
          const description =
            nextLines
              .filter((l) => !l.startsWith("#"))
              .join(" ")
              .trim()
              .slice(0, 150) || "Detaylar gündem özetinde..."

          timelineEvents.push({
            time: currentTime,
            title,
            description,
          })

          const [hour, minute] = currentTime.split(":").map(Number)
          const newMinute = minute + 45
          currentTime = `${String(hour + Math.floor(newMinute / 60)).padStart(2, "0")}:${String(newMinute % 60).padStart(2, "0")}`
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ReadingProgress />
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10 text-center animate-fade-in">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">{formattedDate}</p>
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            {digest.title || "Gündem"}
          </h1>
          {digest.intro && (
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">{digest.intro}</p>
          )}
          <Link
            href="/share-preview"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Share2 className="h-4 w-4" />
            Sosyal Medya Kartı Oluştur
          </Link>
        </header>

        <section className="mb-10 animate-slide-up animation-delay-200">
          <AudioSummary date={digest.digest_date} spotifyUrl={digest.spotify_url || null} />
        </section>

        {/* Kapak Görseli */}
        {digest.cover_image_url && (
          <div className="relative mb-10 h-48 w-full overflow-hidden rounded-xl sm:h-64 animate-slide-up animation-delay-300">
            <Image
              src={digest.cover_image_url || "/placeholder.svg"}
              alt={`${digest.title || "Gündem"} - ${formattedDate} kapak görseli`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Günlük Özet */}
        <article className="mb-12 animate-slide-up animation-delay-400">
          <DigestCard digest={digest} showHeader={false} />
        </article>

        {/* Günlük Kronolojisi */}
        {timelineEvents.length > 0 && (
          <>
            <section className="mb-12 animate-slide-up animation-delay-600">
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Günün Kronolojisi</h2>
              <NewsTimeline events={timelineEvents} />
            </section>
            <SectionDivider />
          </>
        )}

        <SectionDivider />

        {/* Önemli Tweetler */}
        {tweets && tweets.length > 0 && (
          <section className="mb-12">
            <ImportantTweets tweets={tweets} />
          </section>
        )}

        <SectionDivider />

        {/* Geri Bildirim */}
        <section className="mb-12">
          <ReactionButtons digestId={digest.id} />
        </section>

        {/* Gün Navigasyonu - Use digest_date */}
        <DayNavigation currentDate={digest.digest_date} />
      </main>

      <Footer />
      <ScrollToTop />
      <NewsletterPopup />
    </div>
  )
}
