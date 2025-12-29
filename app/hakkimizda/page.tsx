import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Newspaper, Users, Target, Sparkles, Zap, Brain, Headphones, BarChart3, Clock, Shield, Globe } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Biz Kimiz? - D4ily Hakkında | Türkiye'nin Yapay Zeka Destekli Haber Platformu",
    description: "D4ily, Türkiye gündemini yapay zeka ile analiz edip 5 dakikada öğrenmenizi sağlayan modern haber platformudur. Misyonumuz, vizyonumuz ve ekibimiz hakkında bilgi edinin.",
    keywords: ["d4ily hakkında", "biz kimiz", "yapay zeka haber", "türkiye gündem özeti", "haber platformu"],
    openGraph: {
        title: "Biz Kimiz? - D4ily Hakkında",
        description: "Türkiye gündemini yapay zeka ile analiz edip 5 dakikada öğrenmenizi sağlayan modern haber platformu.",
        type: "website",
        url: "https://d4ily.com/hakkimizda",
    },
    twitter: {
        card: "summary_large_image",
        title: "Biz Kimiz? - D4ily Hakkında",
        description: "Türkiye gündemini yapay zeka ile analiz edip 5 dakikada öğrenmenizi sağlayan modern haber platformu.",
    },
    alternates: {
        canonical: "https://d4ily.com/hakkimizda",
    },
}

// JSON-LD for SEO
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "D4ily Hakkında",
    description: "Türkiye gündemini yapay zeka ile analiz edip 5 dakikada öğrenmenizi sağlayan modern haber platformu.",
    url: "https://d4ily.com/hakkimizda",
    mainEntity: {
        "@type": "Organization",
        name: "D4ily",
        url: "https://d4ily.com",
        foundingDate: "2025",
        description: "Yapay zeka destekli Türkiye gündem özeti platformu",
    },
}

export default function AboutPage() {
    const stats = [
        { value: "500+", label: "Kaynak Taranıyor", icon: Globe },
        { value: "07:00", label: "Her Sabah Yayında", icon: Clock },
        { value: "5 dk", label: "Okuma Süresi", icon: Zap },
        { value: "%100", label: "Ücretsiz", icon: Shield },
    ]

    const features = [
        {
            icon: Brain,
            title: "Yapay Zeka Analizi",
            description: "Google Gemini AI ile haberleri analiz ediyor, özetliyor ve kategorilendiriyoruz.",
            color: "bg-purple-500/10 text-purple-600",
        },
        {
            icon: Newspaper,
            title: "Günlük Özet",
            description: "Her sabah 07:00'de yayınlanan, 5 dakikada okuyabileceğiniz rafine gündem özeti.",
            color: "bg-blue-500/10 text-blue-600",
        },
        {
            icon: Headphones,
            title: "Sesli Özet",
            description: "Podcast formatında dinleyebileceğiniz günlük özetler. Spotify'da takip edebilirsiniz.",
            color: "bg-green-500/10 text-green-600",
        },
        {
            icon: BarChart3,
            title: "Trend Analizi",
            description: "Sosyal medya trendlerini ve gündemdeki konuları anlık olarak takip ediyoruz.",
            color: "bg-orange-500/10 text-orange-600",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="container mx-auto px-4 max-w-5xl">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ana Sayfaya Dön
                    </Link>

                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center gap-3 mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                                <Newspaper className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
                            Bilgi Kirliliğini Eliyoruz,{" "}
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Gündemi Sunuyoruz
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            D4ily, Türkiye gündemini yapay zeka ile analiz edip{" "}
                            <strong className="text-foreground">5 dakikada</strong> öğrenmenizi sağlayan
                            modern bir haber platformudur.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <stat.icon className="h-6 w-6 mx-auto mb-3 text-primary" />
                                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                                <Target className="h-4 w-4" />
                                Misyonumuz
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                                Karmaşık Gündemi, Herkes İçin Anlaşılır Hale Getirmek
                            </h2>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Günümüzde binlerce haber kaynağı, sosyal medya paylaşımı ve resmi açıklama arasında
                                kaybolmak çok kolay. D4ily olarak, bu bilgi karmaşasını sizin için filtreliyor,
                                doğruluyor ve anlaşılır bir formatta sunuyoruz.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Amacımız, yoğun hayat temposunda bile gündemden kopmadan, doğru ve tarafsız
                                bilgiye <strong className="text-foreground">hızlıca</strong> ulaşmanızı sağlamak.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="text-6xl md:text-7xl font-bold text-primary mb-2">5</div>
                                    <div className="text-lg text-muted-foreground">dakikada</div>
                                    <div className="text-2xl font-bold text-foreground">Tüm Gündem</div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/10 rounded-xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                            <Sparkles className="h-4 w-4" />
                            Ne Yapıyoruz?
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif">
                            Gündem Takibini Kolaylaştırıyoruz
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team/Creator Section */}
            <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                        <Users className="h-4 w-4" />
                        Ekip
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
                        Bağımsız Bir Teknoloji Girişimi
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        D4ily, bağımsız bir teknoloji girişimi olarak geliştirilmektedir.
                        Yapay zeka ve modern web teknolojilerini kullanarak haber tüketim deneyimini
                        yeniden tanımlamayı hedefliyoruz.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://uclergnlts.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                U
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-foreground">Uçler Günaltış</div>
                                <div className="text-xs text-muted-foreground">Kurucu & Geliştirici</div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">
                        Gündemi Takip Etmeye Başlayın
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Her sabah gündem özetiniz hazır olsun.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            <Newspaper className="h-5 w-5" />
                            Bugünün Özetini Oku
                        </Link>
                        <Link
                            href="/arsiv"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-card border border-border rounded-xl font-semibold hover:bg-muted transition-colors"
                        >
                            Arşivi İncele
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-12 border-t border-border">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <p className="text-muted-foreground">
                        Soru, öneri ve işbirliği teklifleri için:{" "}
                        <a
                            href="mailto:info@d4ily.com"
                            className="text-primary hover:underline font-medium"
                        >
                            info@d4ily.com
                        </a>
                    </p>
                </div>
            </section>
        </div>
    )
}
