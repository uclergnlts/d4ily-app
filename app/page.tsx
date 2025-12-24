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
} from "lucide-react"
import { getLatestDigestDate, getArchiveDigests, getTrendingTopics } from "@/lib/digest-data"
import { NewsletterForm } from "@/components/newsletter-form"
import { getLatestPodcastEpisode } from "@/lib/podcast"
import { TrendingHashtags } from "@/components/trending-hashtags"

export const metadata: Metadata = {
  title: "D4ily - Türkiye Günlük Haber Özeti | 5 Dakikada Gündem",
  description:
    "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 500+ tweet hesabı, 50+ haber kaynağı. Sabah kahvenizi içerken 5 dakikada tüm önemli gelişmeleri öğrenin.",
  alternates: {
    canonical: "https://d4ily.com",
  },
  openGraph: {
    title: "D4ily - Türkiye Günlük Haber Özeti",
    description: "Türkiye gündemini her gün yapay zeka ile analiz edip 5 dakikada tüm önemli gelişmeler.",
    url: "https://d4ily.com",
    type: "website",
  },
}

export default async function HomePage() {
  const latestDigestDate = await getLatestDigestDate()
  const recentDigests = await getArchiveDigests()
  const trendingTopics = await getTrendingTopics(7)
  const latestPodcast = await getLatestPodcastEpisode()

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
          text: "D4ily, Türkiye gündemini her gün yapay zeka ile analiz edip 5 dakikada okuyabileceğiniz şekilde özetleyen bir haber platformudur. 500+ tweet hesabı ve 50+ haber kaynağından bilgi toplarız.",
        },
      },
      {
        "@type": "Question",
        name: "Güncellemeler ne zaman yapılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "D4ily her gün sabah saat 06:00'da güncellenir. Böylece kahvaltınızı yaparken günün tüm önemli gelişmelerini öğrenebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Ücretsiz mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, D4ily tamamen ücretsizdir. Tüm günlük özetlere ve arşive herkes erişebilir.",
        },
      },
      {
        "@type": "Question",
        name: "Sesli özet nedir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Her günlük özetin sesli versiyonu da mevcuttur. Okumaya vaktiniz yoksa, podcast gibi dinleyerek gündemi takip edebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Hangi konular ele alınıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "D4ily'de Türkiye siyaseti, ekonomi, uluslararası ilişkiler, spor, teknoloji ve güncel olaylar gibi geniş bir yelpazede konular ele alınmaktadır.",
        },
      },
      {
        "@type": "Question",
        name: "Haber kaynaklarınız neler?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "500'den fazla doğrulanmış Twitter hesabı, 50'den fazla haber sitesi ve resmi kurumların açıklamalarını yapay zeka ile analiz ediyoruz.",
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
      <Navigation />

      <main className="flex-1 w-full">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-12 pb-20 md:pt-32 lg:pb-40 overflow-hidden w-full">
          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[300px] md:h-[600px] md:w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[60px] md:blur-[100px]" />
          <div className="absolute top-20 -right-12 md:right-0 -z-10 h-[200px] w-[200px] md:h-[400px] md:w-[400px] rounded-full bg-blue-500/5 blur-[40px] md:blur-[80px]" />

          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs md:text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-primary/10">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Yapay Zeka Destekli Gündem Analizi</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] md:leading-[1.1]">
                Türkiye Gündemi, <br className="hidden md:block" />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Saniyeler İçinde
                </span>{" "}
                Önünüzde.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed px-2">
                Her sabah binlerce tweet ve yüzlerce haberi sizin için tarıyor,
                analiz ediyor ve <span className="text-foreground font-semibold">5 dakikalık</span> sade bir özete dönüştürüyoruz.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col w-full sm:flex-row sm:w-auto gap-3 pt-2 md:pt-4">
                <Link
                  href={`/${latestDigestDate}`}
                  className="group inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  Bugünün Özetini Oku
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/arsiv"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  Geçmiş Özetler
                </Link>
              </div>

              {/* Social Proof / Stats */}
              <div className="pt-8 md:pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full border-t border-border/40 mt-8 md:mt-12">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold font-serif">500+</span>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Tweet Kaynağı</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold font-serif">50+</span>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Haber Sitesi</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold font-serif">{totalDigests}+</span>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Yayınlanan Özet</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold font-serif">07:00</span>
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Her Sabah</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- FEATURE HIGHLIGHTS (BENTO GRID STYLE) --- */}
        <section className="py-12 md:py-24 bg-secondary/20 border-y border-border/50 w-full">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Neden D4ily?</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Bilgi kirliliğinde kaybolmayın. Size sadece bilmeniz gerekenleri, en saf haliyle sunuyoruz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {/* Card 1: AI Power */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 md:h-64 md:w-64 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all" />
                <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Zap className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Gelişmiş AI Filtreleme</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      Sıradan haber toplayıcıların aksine, D4ily yapay zekası içeriği "anlar".
                      Aynı haberin kopyalarını eler, tık tuzağı başlıkları görmezden gelir ve
                      sadece gerçeği özüne sadık kalarak özetler.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Time */}
              <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 -mr-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/15 transition-all" />
                <div className="flex h-12 w-12 md:h-14 md:w-14 mb-4 md:mb-6 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                  <Clock className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">5 Dakika Yeter</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Saatlerce kaydırma (doomscrolling) yapmaya son. Kahveniz bitmeden gündeme hakim olun.
                </p>
              </div>

              {/* Card 3: Audio */}
              <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 -mr-10 h-32 w-32 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/15 transition-all" />
                <div className="flex h-12 w-12 md:h-14 md:w-14 mb-4 md:mb-6 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                  <Headphones className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Yolda Dinle</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Okumaya müsait değil misiniz? Podcast tadındaki sesli özetlerimizle yolda, sporda gündemden kopmayın.
                </p>
              </div>

              {/* Card 4: Trust */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 md:h-64 md:w-64 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all" />
                <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                    <Shield className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Güvenilir & Doğrulanmış Kaynaklar</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      Twitter'ın bilgi kirliliğinden arındırılmış bir akış. Sadece doğrulanmış gazeteciler,
                      resmi kurumlar ve saygın haber portallarının verilerini işliyoruz. Manipülasyona kapalı.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- LATEST DIGESTS SHOWCASE --- */}
        <section className="py-12 md:py-24 w-full">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
              <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-serif">Son Gündem Özetleri</h2>
                <p className="text-muted-foreground">Kaçırdığınız günleri arşivden yakalayın.</p>
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
                    <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                      {/* Header Gradient */}
                      {/* Header Image or Gradient */}
                      <div className="h-48 md:h-56 relative p-4 md:p-6 flex flex-col justify-between overflow-hidden">
                        {digest.cover_image_url ? (
                          <>
                            <Image
                              src={digest.cover_image_url}
                              alt={digest.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                          </>
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-100 group-hover:opacity-90 transition-opacity`} />
                        )}

                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />

                        <div className="relative z-20 flex justify-between items-start text-white">
                          <div className="flex flex-col">
                            <span className="text-3xl md:text-5xl font-bold tracking-tighter drop-shadow-md">{date.getDate()}</span>
                            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest opacity-90 drop-shadow-sm">
                              {date.toLocaleDateString("tr-TR", { month: "long" })}
                            </span>
                          </div>
                          <div className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] md:text-xs font-semibold border border-white/10 shadow-sm">
                            {idx === 0 ? 'Son Yayın' : date.getFullYear()}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                        <h3 className="text-lg md:text-xl font-bold font-serif leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {digest.title || "Günün Gündem Özeti"}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {digest.intro}
                        </p>
                        <div className="pt-2 flex items-center text-xs font-medium text-muted-foreground gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 5 dk okuma
                          </span>
                          {idx === 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" /> Popüler
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/arsiv" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Tüm Arşivi Gör
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* --- TRENDING TOPICS (PILL DESIGN) --- */}
        <section className="py-12 md:py-16 border-y border-border/40 bg-accent/20 w-full">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8 justify-center">
              <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500 animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold font-serif text-center">Bu Hafta Neler Konuşuluyor?</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
              {trendingTopics.map((topic, i) => (
                <Link
                  key={topic.word}
                  href={`/konu/${topic.word.toLowerCase()}`}
                  className="group flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="text-primary/50 text-xs font-bold mr-1">#{i + 1}</span>
                  {topic.word}
                  {topic.change === 'up' && <TrendingUp className="h-3 w-3 text-green-500 ml-1" />}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- PODCAST CTA --- */}
        <section className="py-12 md:py-24 relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-neutral-900 -z-20" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 -z-10 mix-blend-overlay" />

          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-white">
              <div className="space-y-6 md:space-y-8 animate-fade-in-right order-2 md:order-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-400 border border-green-500/30">
                  <Mic className="h-4 w-4" />
                  <span>D4ily Podcast</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight">
                    Gözlerinizi Dinlendirin, <br />
                    Kulaklarınızı Açın.
                  </h2>
                  {latestPodcast ? (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-green-400 text-sm font-semibold tracking-wide uppercase">Son Bölüm Yayında • {new Date(latestPodcast.pubDate).toLocaleDateString('tr-TR')}</span>
                      <p className="text-white text-lg md:text-xl font-medium line-clamp-2">
                        {latestPodcast.title}
                      </p>
                    </div>
                  ) : null}
                </div>

                <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                  Her sabahın özeti, profesyonel seslendirme ve akıcı bir anlatımla podcast platformlarında.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a href={latestPodcast?.link || "https://open.spotify.com/show/1zytVKv9PQmGuKGhWLEzfU?si=d72b6680d2bd4af1"} target="_blank" rel="noopener"
                    className="flex items-center gap-3 rounded-full bg-[#1DB954] px-6 py-3 md:px-8 md:py-4 font-bold text-black transition-transform hover:scale-105 active:scale-95 text-sm md:text-base">
                    <PlayCircle className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                    {latestPodcast ? "Son Bölümü Dinle" : "Spotify'da Dinle"}
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center animate-fade-in-left order-1 md:order-2">
                <div className="relative w-48 h-48 md:w-80 md:h-80 z-10">
                  {/* Placeholder for visuals or album art. Using a stylized div for now */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-blue-600 rounded-3xl rotate-6 opacity-30 blur-lg animate-pulse" />
                  <div className="absolute inset-0 bg-neutral-800 rounded-3xl border border-neutral-700 shadow-2xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/podcast-cover.png"
                      alt="Podcast Cover"
                      width={320} height={320}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-20 md:py-32 text-center bg-background relative overflow-hidden w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[120px] -z-10" />
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 md:mb-6 tracking-tight">E-Bültene Abone Olun</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8 md:mb-10">
              Her sabah 07:00'da gündemi mail kutunuza getirelim. Ücretsiz.
            </p>

            <NewsletterForm />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
