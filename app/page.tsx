import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  Flame,
  Headphones,
  Mic,
  PlayCircle,
  FileText,
  ScanSearch,
  BrainCircuit,
  Newspaper,
  Calendar,
  MessageSquare
} from "lucide-react"
import { getLatestDigestDate, getArchiveDigests, getTrendingTopics, getLatestWeeklyDigest } from "@/lib/digest-data"
import { NewsletterForm } from "@/components/newsletter-form"
import { getLatestPodcastEpisode } from "@/lib/podcast"
import { MarketWidget } from "@/components/market-widget"
import { OfficialGazetteCard } from "@/components/official-gazette-card"
import { getOfficialGazetteSummary } from "@/lib/services/official-gazette"
import { PodcastScrollLink } from "@/components/podcast-scroll-link"
import { Ticker } from "@/components/ticker"

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

export const revalidate = 0;

export default async function HomePage() {
  const [
    latestDigestDate,
    recentDigests,
    trendingTopics,
    latestPodcast,
    latestWeekly,
    gazetteSummary,
  ] = await Promise.all([
    getLatestDigestDate(),
    getArchiveDigests(),
    getTrendingTopics(7),
    getLatestPodcastEpisode().catch(() => null),
    getLatestWeeklyDigest(),
    getOfficialGazetteSummary().catch(() => null),
  ])

  const recentSix = recentDigests.slice(0, 6)
  const totalDigests = recentDigests.length

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

  const getGradientForDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const dayIndex = date.getDate() % 7
    const gradients = [
      "from-blue-500 via-cyan-500 to-teal-500",
      "from-purple-500 via-pink-500 to-rose-500",
      "from-green-500 via-emerald-500 to-teal-500",
      "from-orange-500 via-red-500 to-pink-500",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-indigo-500 via-purple-500 to-pink-500",
      "from-rose-500 via-pink-500 to-fuchsia-500",
    ]
    return gradients[dayIndex]
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Ticker />
      <Navigation />

      <main className="flex-1 w-full">
        {/* --- HERO SECTION (REFINED) --- */}
        <section className="relative pt-20 pb-20 md:pt-32 lg:pb-32 overflow-hidden w-full bg-background border-b border-border/30">
          {/* Subtle Background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs md:text-sm font-medium text-primary mb-8 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Yapay Zeka Destekli Gündem Analizi</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.1] mb-6">
              Bilgi Kirliliğinde Kaybolma, <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Gündeme Hakim Ol.
              </span>
            </h1>

            <p className="text-lg sm:text-2xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Binlerce haber, tweet ve resmi açıklamayı analiz ediyoruz.
              Size sadece en saf, rafine ve doğrulanmış özeti sunuyoruz.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href={`/${latestDigestDate}`}
                className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-foreground px-8 text-lg font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] shadow-xl shadow-black/5"
              >
                <FileText className="mr-2 h-5 w-5" />
                Bugünün Özetini Oku
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <PodcastScrollLink />
            </div>

            {/* TRUST GRID (SIMPLIFIED) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-t border-border/40 pt-10 px-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">500+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Kaynak Taranıyor</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">07:00</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Her Sabah Yayında</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">5 Dk</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Okuma Süresi</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">%100</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Yapay Zeka & Editör</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- HOW IT WORKS (NEW) --- */}
        <section className="py-16 border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3">Nasıl Çalışır?</h2>
              <p className="text-muted-foreground">Karmaşık gündemi sizin için nasıl sadeleştiriyoruz?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector Lines (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-border via-primary/30 to-border z-0" />

              {/* Step 1 */}
              <div className="relative z-10 bg-background/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                  <ScanSearch className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">1. Veri Tarama</h3>
                <p className="text-sm text-muted-foreground">Twitter'da doğrulanmış 500+ gazeteci, haber ajansı ve resmi kurumun paylaşımları taranır.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 bg-background/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 mb-4 shadow-sm">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">2. AI Analizi</h3>
                <p className="text-sm text-muted-foreground">D4ily AI motoru; tekrarlananları eler, tık tuzağı başlıkları ayıklar ve konuyu özüne indirger.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 bg-background/50 backdrop-blur border border-border/50 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 mb-4 shadow-sm">
                  <Newspaper className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">3. Günlük Özet</h3>
                <p className="text-sm text-muted-foreground">Her sabah 07:00'de, okunması 5 dakika süren rafine bir bülten ve sesli özet sunulur.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MARKET & GAZETTE --- */}
        <section className="py-12 border-b border-border/40 w-full bg-background">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-xl">Piyasalarda Son Durum</h3>
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <MarketWidget />
              </div>
              <div className="lg:col-span-1 h-full">
                <OfficialGazetteCard summary={gazetteSummary} />
              </div>
            </div>
          </div>
        </section>

        {/* --- LATEST DIGESTS --- */}
        <section className="py-16 md:py-24 bg-secondary/10 w-full">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-serif mb-2">Gündem Arşivi</h2>
                <p className="text-muted-foreground">Geçmiş günlerin özetlerine göz atın.</p>
              </div>
              <Link href="/arsiv" className="group hidden md:flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Tüm Arşivi Gör
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentSix.map((digest, idx) => {
                const gradient = getGradientForDate(digest.digest_date)
                const date = new Date(digest.digest_date)
                return (
                  <Link key={digest.digest_date} href={`/${digest.digest_date}`} className="group relative block h-full">
                    <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                      {/* Image Area */}
                      <div className="h-48 relative overflow-hidden bg-muted">
                        {digest.cover_image_url ? (
                          <>
                            <Image
                              src={digest.cover_image_url}
                              alt={digest.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
                        )}

                        <div className="absolute top-4 left-4 inline-flex items-center rounded-md bg-background/90 px-2 py-1 text-xs font-bold shadow-sm">
                          {date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col h-[200px]">
                        <h3 className="text-xl font-bold font-serif leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {digest.title || "Günün Gündem Özeti"}
                        </h3>
                        <p className="text-sm text-balance text-muted-foreground line-clamp-3 leading-relaxed mb-auto">
                          {digest.intro}
                        </p>

                        <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> 5 dk okuma
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform text-primary flex items-center gap-1">
                            Oku <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/arsiv" className="btn-secondary w-full justify-center">
                Tüm Arşivi Gör
              </Link>
            </div>
          </div>
        </section>

        {/* --- WEEKLY DIGEST PREVIEW (CLEANER) --- */}
        {latestWeekly && (
          <section className="py-16 md:py-20 border-y border-border/40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50" />

            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
              <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden md:flex">
                <div className="md:w-1/3 bg-primary/10 p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-border/50">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-1">Haftalık Özeti</h3>
                  <p className="text-sm text-muted-foreground opacity-80">Son 7 Günün Panoraması</p>
                </div>
                <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                    <span>Hafta {latestWeekly.week_number}</span>
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span>{latestWeekly.year}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{latestWeekly.title}</h2>
                  <p className="text-muted-foreground mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {latestWeekly.intro}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href={`/hafta/${latestWeekly.week_id}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                      Özeti İncele <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/haftalik-ozet" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Tüm Haftalar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- TRENDING HASHTAGS --- */}
        <section className="py-12 bg-background w-full">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold font-serif">Sosyal Medya Gündeminde Neler Var?</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTopics.map((topic) => (
                <Link
                  key={topic.word}
                  href={`/konu/${topic.word.toLowerCase()}`}
                  className="px-4 py-1.5 rounded-full border border-border/60 bg-secondary/30 text-sm hover:border-primary/50 hover:bg-background transition-all"
                >
                  #{topic.word}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- PODCAST SECTION (COMPACT) --- */}
        <section className="py-16 md:py-24 bg-zinc-950 text-white overflow-hidden relative w-full">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-green-400 font-bold tracking-wide text-xs uppercase">
                  <Headphones className="h-4 w-4" />
                  Audio Experience
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                  Gözlerinizi dinlendirin. <br />
                  <span className="text-green-500">Kulağınız bizde olsun.</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  D4ily Podcast ile gündem, siz neredeyseniz orada. Yapay zeka seslendirmesiyle 5 dakikalık akıcı özetler.
                </p>
                <div className="flex gap-4 pt-2">
                  <a href={latestPodcast?.link || "#"} target="_blank" className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition-colors">
                    <PlayCircle className="h-5 w-5" />
                    Şimdi Dinle
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src="/podcast-cover.png"
                    alt="D4ily Podcast"
                    width={600} height={600}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <div>
                      <p className="text-green-400 text-sm font-bold mb-1">YENİ BÖLÜM</p>
                      <p className="text-xl font-bold line-clamp-2">{latestPodcast?.title || "Bugünün Gündem Özeti"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- NEWSLETTER CTA (MINIMALIST) --- */}
        <section className="py-20 bg-background text-center w-full border-t border-border">
          <div className="container mx-auto px-4 max-w-md">
            <h2 className="text-2xl font-bold font-serif mb-3">Günü Kaçırmayın</h2>
            <p className="text-muted-foreground mb-8">Her sabah 07:00'de gündem cebinizde.</p>
            <NewsletterForm />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
