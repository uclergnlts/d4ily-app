import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Newspaper, Users, Target, Sparkles, Zap, Brain, Headphones, BarChart3, Clock, Shield, Globe } from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
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
            description: "Google Gemini AI teknolojisi ile her gün binlerce haberi tarıyor, analiz ediyor ve en önemli gelişmeleri sizin için seçiyoruz.",
            color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        },
        {
            icon: Newspaper,
            title: "Özet & Rafine",
            description: "Bilgi kirliliğinden arındırılmış, sadece gerçeğe odaklanan, tarafsız ve yalın bir dille hazırlanmış günlük özetler.",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
            icon: Headphones,
            title: "Sesli Deneyim",
            description: "Okumaya vaktiniz yoksa dinleyin. Yapay zeka tarafından seslendirilen podcast formatındaki özetlerimizle yolda, sporda habersiz kalmayın.",
            color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        },
        {
            icon: BarChart3,
            title: "Veri Odaklı Trendler",
            description: "Sadece haberleri değil, sosyal medyanın nabzını da tutuyoruz. Nelerin konuşulduğunu ve trend olduğunu veri analitiği ile sunuyoruz.",
            color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <Header />
            <div className="pt-4">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Hero Section */}
                <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(0,0,0,0))]" />

                    <div className="container mx-auto px-4 max-w-5xl">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Ana Sayfaya Dön
                        </Link>

                        <div className="text-center max-w-4xl mx-auto mb-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase mb-6">
                                <Sparkles className="h-3 w-3" />
                                Yeni Nesil Habercilik
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-8 tracking-tight text-balance">
                                Bilgi Kirliliğini Eliyoruz,<br className="hidden md:block" />
                                <span className="text-primary">Gündemi Sunuyoruz</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
                                D4ily, karmaşık Türkiye gündemini yapay zeka ile analiz edip, size zaman kazandıran ve sadece gerçeklere odaklanan modern bir haber platformudur.
                            </p>
                        </div>

                        {/* Stats Grid - Floating Card Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                                    <stat.icon className="h-6 w-6 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50" />

                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="order-2 md:order-1">
                                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-6">
                                    <Target className="h-4 w-4" />
                                    Misyonumuz
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-8 leading-tight">
                                    Gündem Takibini Herkes İçin <span className="text-primary italic">Zahmetsiz</span> Hale Getirmek
                                </h2>
                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    <p>
                                        Modern dünyada bilgiye ulaşmak kolay, ancak doğru bilgiye ulaşmak zorlaştı. Binlerce kaynak, sahte haberler ve manipülasyonlar arasında gerçeği bulmak ciddi bir zaman ve efor gerektiriyor.
                                    </p>
                                    <p>
                                        <strong className="text-foreground font-semibold">D4ily</strong> tam da bu sorunu çözmek için doğdu. Gelişmiş yapay zeka algoritmalarımız, her sabah binlerce içeriği tarar, doğrular ve özetler. Size sadece bilmeniz gereken, rafine edilmiş özü sunar.
                                    </p>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 relative">
                                <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary to-blue-600 p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full bg-background rounded-[2.8rem] flex items-center justify-center p-8 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
                                        <div className="relative text-center z-10">
                                            <div className="text-8xl md:text-9xl font-black text-primary/20 select-none">D4</div>
                                            <div className="text-2xl font-bold text-foreground mt-4">Odaklan.</div>
                                            <div className="text-sm text-muted-foreground mt-2">Gürültüden uzaklaş.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-4">
                                <Sparkles className="h-4 w-4" />
                                Özellikler
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
                                Neden D4ily?
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Sıradan bir haber sitesi değil, akıllı bir gündem asistanı.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {features.map((feature, i) => (
                                <div
                                    key={feature.title}
                                    className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
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
                <section className="py-20 md:py-32 bg-secondary/30">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-6">
                            <Users className="h-4 w-4" />
                            Geliştirici
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-8">
                            Bağımsız ve Şeffaf<br />Bir Teknoloji Girişimi
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            D4ily, teknoloji ve gazeteciliğin kesiştiği noktada, tamamen bağımsız bir vizyonla geliştirilmiştir.
                        </p>

                        <div className="inline-block group">
                            <a
                                href="https://uclergnlts.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 pl-4 pr-8 py-4 bg-background border border-border rounded-full hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-inner">
                                    <Image
                                        src="/images/ucler-gunaltis.jpg"
                                        alt="Uçler Günaltış"
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Uçler Günaltış</div>
                                    <div className="text-sm text-muted-foreground">Kurucu & Full Stack Geliştirici</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-4xl md:text-6xl font-bold font-serif mb-8 tracking-tight">
                            Gündemi Yakalamaya<br />Hazır mısınız?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                            Her sabah 07:00&apos;de, kahvenizden önce günün özeti e-postanızda ve bu platformda.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex h-14 items-center gap-2 px-8 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                <Newspaper className="h-5 w-5" />
                                Okumaya Başla
                            </Link>
                            <Link
                                href="/arsiv"
                                className="inline-flex h-14 items-center gap-2 px-8 bg-background border-2 border-muted hover:border-primary/50 text-foreground rounded-full text-lg font-semibold hover:bg-secondary transition-all"
                            >
                                Arşivi İncele
                            </Link>
                        </div>

                        <div className="mt-16 pt-8 border-t border-border/50">
                            <p className="text-muted-foreground">
                                İletişim & İşbirliği:{" "}
                                <a href="mailto:info@d4ily.com" className="text-primary font-semibold hover:underline">
                                    info@d4ily.com
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    )
}
