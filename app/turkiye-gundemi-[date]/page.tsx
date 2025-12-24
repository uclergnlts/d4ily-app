import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDigestByDate, formatDateTR } from "@/lib/digest-data"
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
import { getTopTweetsByDate } from "@/lib/digest-data"
import Image from "next/image"
import { NewsTimeline, type TimelineEvent } from "@/components/news-timeline"

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params
  const digest = await getDigestByDate(date)

  if (!digest) {
    return {
      title: "Özet Bulunamadı | D4ily",
    }
  }

  const description = digest.intro || digest.content.slice(0, 160)
  const title = digest.title || `Türkiye Gündemi - ${formatDateTR(digest.digest_date)}`
  const imageUrl = digest.cover_image_url || "/og-image.jpg"

  return {
    title: `${title} | D4ily`,
    description,
    alternates: {
      canonical: `https://d4ily.com/turkiye-gundemi-${digest.digest_date}`,
    },
    openGraph: {
      title: `${title} | D4ily`,
      description,
      url: `https://d4ily.com/turkiye-gundemi-${digest.digest_date}`,
      type: "article",
      publishedTime: digest.created_at || digest.digest_date,
      modifiedTime: digest.updated_at || digest.created_at || digest.digest_date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | D4ily`,
      description,
      images: [imageUrl],
    },
  }
}

export default async function TurkiyeGundemiPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const digest = await getDigestByDate(date)
  const tweets = await getTopTweetsByDate(date, 5)

  if (!digest) {
    notFound()
  }

  const formattedDate = formatDateTR(digest.digest_date)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: digest.title || "Türkiye Gündem Özeti",
    description: digest.intro || "Günlük Türkiye gündem özeti",
    image: digest.cover_image_url || "https://d4ily.com/og-image.jpg",
    datePublished: digest.digest_date,
    dateModified: digest.updated_at || digest.digest_date,
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
      "@id": `https://d4ily.com/turkiye-gundemi-${digest.digest_date}`,
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
        name: formattedDate,
        item: `https://d4ily.com/turkiye-gundemi-${digest.digest_date}`,
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
        <header className="mb-10 text-center animate-fade-in">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">{formattedDate}</p>
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            {digest.title || "Gündem"}
          </h1>
          {digest.intro && (
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">{digest.intro}</p>
          )}
        </header>

        <section className="mb-10 animate-slide-up animation-delay-200">
          <AudioSummary date={digest.digest_date} spotifyUrl={digest.spotify_url || null} />
        </section>

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

        <article className="mb-12 animate-slide-up animation-delay-400">
          <DigestCard digest={digest} showHeader={false} />
        </article>

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

        {tweets && tweets.length > 0 && (
          <section className="mb-12">
            <ImportantTweets tweets={tweets} />
          </section>
        )}

        <SectionDivider />

        <section className="mb-12">
          <ReactionButtons digestId={digest.id} />
        </section>

        <DayNavigation currentDate={digest.digest_date} />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
