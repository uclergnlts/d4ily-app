import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import NewsFeed from "@/components/news-feed"
import Image from "next/image"
import {
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
  Headphones,
  PlayCircle,
  FileText,
  Calendar,
  ChevronRight,
  Zap
} from "lucide-react"
import { getLatestDigestDate, getArchiveDigests, getTrendingTopics, getLatestWeeklyDigest } from "@/lib/digest-data"
import { NewsletterForm } from "@/components/newsletter-form"
import { getLatestPodcastEpisode } from "@/lib/podcast"

export const metadata: Metadata = {
  title: "D4ily - Türkiye Gündemi, En Saf Haliyle",
  description:
    "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 500+ tweet hesabı, 50+ haber kaynağı. Sabah kahvenizi içerken 5 dakikada tüm önemli gelişmeleri öğrenin.",
  alternates: {
    canonical: "https://d4ily.com",
  },
  openGraph: {
    title: "D4ily - Türkiye Günlük Haber Özeti",
    description: "Bilgi kirliliğinden arındırılmış, yapay zeka destekli günlük haber özeti.",
    url: "https://d4ily.com",
    type: "website",
  },
}

export const revalidate = 60

export default async function HomePage() {
  // ⚡ Performance: Run all database queries in parallel
  const [
    latestDigestDate,
    recentDigests,
    trendingTopics,
    latestPodcast,
    latestWeekly
  ] = await Promise.all([
    getLatestDigestDate(),
    getArchiveDigests(),
    getTrendingTopics(5),
    getLatestPodcastEpisode(),
    getLatestWeeklyDigest()
  ])

  const recentThree = recentDigests.slice(0, 3)
  const latestDigest = recentDigests[0]

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "D4ily nedir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "D4ily, Türkiye gündemini her gün yapay zeka ile analiz edip 5 dakikada okuyabileceğiniz şekilde özetleyen yeni nesil bir haber platformudur.",
        },
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navigation />

      <main className="flex-1 w-full">

        {/* ===== HERO - SIMPLE & FOCUSED ===== */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-28 overflow-hidden">
          {/* Refined Background with Grid Pattern */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 max-w-4xl">
            {/* 4 in 1 Badge - Glassmorphism */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-background/60 backdrop-blur-md px-5 py-2 shadow-sm animate-fade-in">
                <span className="text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">4</span>
                <span className="text-xs font-semibold text-muted-foreground tracking-wide">in 1</span>
                <div className="w-px h-4 bg-border/60" />
                <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                  <span className="hover:text-primary transition-colors cursor-default">Gündem</span>
                  <span className="text-primary/40">•</span>
                  <span className="hover:text-primary transition-colors cursor-default">Analiz</span>
                  <span className="text-primary/40">•</span>
                  <span className="hover:text-primary transition-colors cursor-default">Trend</span>
                  <span className="text-primary/40">•</span>
                  <span className="hover:text-primary transition-colors cursor-default">Özet</span>
                </div>
              </div>
            </div>

            {/* Headline - Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-center leading-[1.1] tracking-tight mb-6 text-balance">
              Türkiye Gündemi,{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                5 Dakikada
              </span>
            </h1>

            <p className="text-center text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed text-balance">
              Her sabah, yüzlerce kaynak taranarak hazırlanan doğrulanmış özeti okuyun.
              Bilgi kirliliği yok, sadece önemli olan.
            </p>

            {/* Single Primary CTA - Premium Button */}
            <div className="flex flex-col items-center gap-6">
              <Link
                href={`/${latestDigestDate}`}
                className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5" />
                <span>Bugünün Özetini Oku</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary action - subtle */}
              <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link href="/akis" className="flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50">
                  <Zap className="h-4 w-4 text-rose-500" />
                  Canlı Akış
                </Link>
                <span className="w-1 h-1 rounded-full bg-border" />
                <Link href="/arsiv" className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50">
                  Arşiv
                </Link>
              </div>
            </div>

            {/* Stats Cards - Premium Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16 pt-10 border-t border-border/40">
              {/* 500+ Kaynak */}
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4 md:p-6 text-center hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-black text-foreground bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1 md:mb-2">
                    500+
                  </div>
                  <div className="text-[10px] md:text-xs font-semibold text-muted-foreground/80 uppercase tracking-widest">
                    Kaynak
                  </div>
                </div>
              </div>

              {/* 07:00 */}
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4 md:p-6 text-center hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-black text-foreground bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-1 md:mb-2">
                    07:00
                  </div>
                  <div className="text-[10px] md:text-xs font-semibold text-muted-foreground/80 uppercase tracking-widest">
                    Her Sabah
                  </div>
                </div>
              </div>

              {/* 5 dk */}
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-4 md:p-6 text-center hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-black text-foreground bg-gradient-to-br from-green-600 to-emerald-500 bg-clip-text text-transparent mb-1 md:mb-2">
                    5 dk
                  </div>
                  <div className="text-[10px] md:text-xs font-semibold text-muted-foreground/80 uppercase tracking-widest">
                    Okuma Süresi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TODAY'S DIGEST HIGHLIGHT ===== */}
        {latestDigest && (
          <section className="py-8 md:py-12 bg-muted/30 border-y border-border/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link href={`/${latestDigest.digest_date}`} className="group block">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Image */}
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-muted relative">
                    {latestDigest.cover_image_url ? (
                      <Image
                        src={latestDigest.cover_image_url}
                        alt={latestDigest.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Sparkles className="h-3 w-3" />
                        Bugünün Özeti
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(latestDigest.digest_date).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold font-serif mb-3 group-hover:text-primary transition-colors">
                      {latestDigest.title || "Günün Gündem Özeti"}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mb-4">
                      {latestDigest.intro}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Özeti Oku
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ===== TRENDING TOPICS - COMPACT ===== */}
        {trendingTopics.length > 0 && (
          <section className="py-6 border-b border-border/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Trend
                </span>
                {trendingTopics.map((topic) => (
                  <Link
                    key={topic.word}
                    href={`/konu/${topic.word.toLowerCase()}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all"
                  >
                    #{topic.word}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== NEWS FEED ===== */}
        <NewsFeed />

        {/* ===== RECENT DIGESTS ===== */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold font-serif">Gündem Arşivi</h2>
              <Link href="/arsiv" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                Tümü
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {recentThree.map((digest) => (
                <Link key={digest.digest_date} href={`/${digest.digest_date}`} className="group">
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
                    {/* Image */}
                    <div className="aspect-video relative bg-muted">
                      {digest.cover_image_url ? (
                        <Image
                          src={digest.cover_image_url}
                          alt={digest.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      )}
                      <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                        {new Date(digest.digest_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {digest.title || "Günün Özeti"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        5 dk okuma
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WEEKLY DIGEST - COMPACT ===== */}
        {latestWeekly && (
          <section className="py-12 border-y border-border/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link href={`/hafta/${latestWeekly.week_id}`} className="group block">
                <div className="flex items-center gap-6 p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="hidden sm:flex w-16 h-16 bg-primary/10 rounded-xl items-center justify-center flex-shrink-0">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Hafta {latestWeekly.week_number} · {latestWeekly.year}
                    </div>
                    <h3 className="font-bold text-lg md:text-xl truncate group-hover:text-primary transition-colors">
                      {latestWeekly.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {latestWeekly.intro}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ===== PODCAST - SIMPLE ===== */}
        <section className="py-12 md:py-16 bg-zinc-900 text-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Podcast Cover */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                <Image
                  src="/podcast-cover.png"
                  alt="D4ily Podcast"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Headphones className="h-3.5 w-3.5" />
                  Podcast
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                  Dinleyerek Takip Et
                </h2>
                <p className="text-zinc-400 text-sm mb-4">
                  Gündem özeti, 5 dakikalık sesli format. Okumaya vaktiniz yoksa dinleyin.
                </p>
                <a
                  href={latestPodcast?.link || "https://open.spotify.com/show/1zytVKv9PQmGuKGhWLEzfU"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-green-400 transition-colors"
                >
                  <PlayCircle className="h-4 w-4" />
                  Spotify'da Dinle
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER - MINIMAL ===== */}
        <section className="py-12 md:py-16 bg-background border-t border-border">
          <div className="container mx-auto px-4 max-w-md text-center">
            <h2 className="text-xl font-bold font-serif mb-2">Günü Kaçırmayın</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Her sabah 07:00'de gündem cebinizde.
            </p>
            <NewsletterForm />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
