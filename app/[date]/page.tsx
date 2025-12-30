import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Navigation from "@/components/navigation"
import DigestCard from "@/components/digest-card"
import Footer from "@/components/footer"
import AudioSummary from "@/components/audio-summary"
import ImportantTweets from "@/components/important-tweets"
import DayNavigation from "@/components/day-navigation"
import ReactionButtons from "@/components/reaction-buttons"
import { getDigestByDate, getTopTweetsByDate, getAdjacentDigestDates } from "@/lib/digest-data"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { SocialShareDialog } from "@/components/social-share-dialog"
import { ReadingProgress } from "@/components/reading-progress"
import { ExitIntentPopup } from "@/components/exit-intent-popup"

export const revalidate = 3600

const RESERVED_PATHS = ["arsiv", "api", "auth", "_next", "istatistikler", "bugun"]

function isValidDateFormat(date: string): boolean {
  if (RESERVED_PATHS.includes(date.toLowerCase())) return false
  if (!date || date.length !== 10) return false
  const parts = date.split("-")
  if (parts.length !== 3) return false
  const year = Number.parseInt(parts[0])
  const month = Number.parseInt(parts[1])
  const day = Number.parseInt(parts[2])
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false
  if (year < 2020 || year > 2100) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  return true
}

function extractTopics(content: string): string[] {
  const keywords = ["ekonomi", "siyaset", "spor", "teknoloji", "sağlık"]
  const lowerContent = content.toLowerCase()
  return keywords.filter((keyword) => lowerContent.includes(keyword))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const date = resolvedParams.date

  if (!isValidDateFormat(date)) {
    return {
      title: "Sayfa Bulunamadı",
    }
  }

  const digest = await getDigestByDate(date)

  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const title = digest?.title ? `${digest.title} - ${formattedDate}` : `Gündem Özeti - ${formattedDate}`

  const description = digest?.intro
    ? digest.intro.slice(0, 160)
    : `${formattedDate} tarihli Türkiye gündem özeti. Günün önemli gelişmeleri ve en çok konuşulan konular.`

  // Determine OG Image
  // Priority: Dynamic generated image with title > Custom cover image > Default fallback
  const ogTitle = digest?.title || `Türkiye Gündemi - ${formattedDate}`
  const dynamicOgUrl = `/api/og?title=${encodeURIComponent(ogTitle)}&date=${date}`

  const images = [dynamicOgUrl]
  if (digest?.cover_image_url) {
    images.push(digest.cover_image_url)
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://d4ily.com/${date}`,
    },
    openGraph: {
      title,
      description,
      url: `https://d4ily.com/${date}`,
      type: "article",
      publishedTime: digest?.created_at || date,
      modifiedTime: digest?.updated_at || digest?.created_at || date,
      authors: ["D4ily"],
      tags: digest ? extractTopics(digest.content) : [],
      images: images.map(url => ({
        url,
        width: 1200,
        height: 630,
        alt: title,
      })),
      locale: "tr_TR",
      siteName: "D4ily",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [dynamicOgUrl], // Twitter usually picks the first one
      creator: "@d4ilytr",
    },
    other: {
      "article:published_time": digest?.created_at || date,
      "article:modified_time": digest?.updated_at || digest?.created_at || date,
      "article:author": "D4ily",
      "article:section": "Gündem",
    },
  }
}

import { injectInternalLinks } from "@/lib/services/internal-linker"

export default async function DatePage({ params }: { params: Promise<{ date: string }> }) {
  const resolvedParams = await params
  const date = resolvedParams.date

  if (RESERVED_PATHS.includes(date.toLowerCase())) {
    redirect("/" + date)
  }

  if (!isValidDateFormat(date)) {
    notFound()
  }

  // ⚡ Performance: Run all queries in parallel
  const [digest, tweets, adjacentDates] = await Promise.all([
    getDigestByDate(date),
    getTopTweetsByDate(date, 20),
    getAdjacentDigestDates(date)
  ])

  // Inject internal links if digest exists
  if (digest?.content) {
    digest.content = await injectInternalLinks(digest.content);
  }

  const { prevDate, nextDate } = adjacentDates

  const formattedDate = digest
    ? new Date(digest.digest_date).toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : ""

  const articleJsonLd = digest
    ? {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: digest.title || "Türkiye Gündem Özeti",
      description: digest.intro || "Günlük Türkiye gündem özeti",
      image: [
        digest.cover_image_url || `https://d4ily.com/api/og?title=${encodeURIComponent(digest.title || "Gündem Özeti")}&date=${date}`,
      ],
      datePublished: digest.created_at || digest.digest_date,
      dateModified: digest.updated_at || digest.created_at || digest.digest_date,
      author: {
        "@type": "Organization",
        name: "D4ily Editör Ekibi",
        url: "https://d4ily.com",
      },
      publisher: {
        "@type": "Organization",
        name: "D4ily",
        logo: {
          "@type": "ImageObject",
          url: "https://d4ily.com/icons/icon-512x512.jpg",
          width: 512,
          height: 512
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://d4ily.com/${date}`,
      },
      inLanguage: "tr-TR",
      isAccessibleForFree: true,
      keywords: extractTopics(digest.content).join(", "),
      copyrightYear: new Date(digest.digest_date).getFullYear(),
      copyrightHolder: {
        "@type": "Organization",
        name: "D4ily"
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#audio-summary-container", "h1", ".digest-intro"]
      }
    }
    : null

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
        name: "Arşiv",
        item: "https://d4ily.com/arsiv",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formattedDate,
        item: `https://d4ily.com/${date}`,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {articleJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navigation />
      <DayNavigation currentDate={date} prevDate={prevDate} nextDate={nextDate} />

      {digest ? (
        <main className="flex-1 px-4 py-6 sm:py-8">
          <div className="mx-auto max-w-2xl space-y-8">
            <header className="text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {formattedDate}
              </p>
              <h1 className="mb-4 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl">
                {digest.title || "Gündem"}
              </h1>
              {digest.intro && (
                <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {digest.intro}
                </p>
              )}
            </header>

            <AudioSummary date={digest.digest_date} spotifyUrl={digest.spotify_url || null} />
            <DigestCard digest={digest} showHeader={false} />
            <div className="flex justify-center pt-4">
              <SocialShareDialog
                date={digest.digest_date}
                headline={digest.title}
                bulletPoints={extractTopics(digest.content)} // Using topics as bullet points or we could parse intro sentences
                readingTime={`${Math.ceil((digest.content?.length || 3000) / 1000)} dk okuma`}
                coverImageUrl={digest.cover_image_url || undefined}
              />
            </div>
            <ReactionButtons digestId={digest.id} />
            <ImportantTweets tweets={tweets} />
          </div>
        </main>
      ) : (
        <main className="flex-1 px-4 py-16">
          <div className="mx-auto max-w-md rounded-xl bg-card p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">Özet Bulunamadı</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Bu tarih için günlük özet bulunamadı.</p>
            <Link
              href="/arsiv"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Arşive Git
            </Link>
          </div>
        </main>
      )}

      <Footer />
      <ReadingProgress />
      <ExitIntentPopup />
    </div>
  )
}
