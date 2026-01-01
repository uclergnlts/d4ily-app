import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Network, Handshake, BarChart3, Radio, ArrowRight, Building2, Newspaper, TrendingUp } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Partnerlik - D4ily | İşbirliği",
    description: "D4ily ile işbirliği yapın, API entegrasyonları, içerik ortaklıkları ve reklam fırsatları ile birlikte büyüyelim.",
    keywords: ["d4ily partnerlik", "işbirliği", "api entegrasyonu", "medya ortaklığı", "b2b"],
    openGraph: {
        title: "Partnerlik - D4ily",
        description: "D4ily ile güçlerinizi birleştirin.",
        type: "website",
        url: "https://d4ily.com/partnerlik",
    },
    alternates: {
        canonical: "https://d4ily.com/partnerlik",
    },
}

export default function PartnershipPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow pt-8 pb-16 md:pt-12 md:pb-24">
                {/* Hero Section */}
                <section className="relative mb-20 md:mb-32 overflow-hidden px-4">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-5xl text-center pt-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Handshake className="h-3 w-3" />
                            İşbirliği Programı
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Güçlerimizi <span className="text-primary italic">Birleştirelim</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            D4ily'nin gelişmiş yapay zeka altyapısı ve geniş veri havuzu ile işletmenize veya platformunuza değer katın.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Link href="/iletisim?subject=partnership" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                                Partner Olun <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Models Section */}
                <section className="container mx-auto px-4 max-w-6xl mb-24 md:mb-32">
                    <h2 className="text-3xl font-bold font-serif text-center mb-16">İşbirliği Modelleri</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* API Integration */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-indigo-500/30 transition-colors group">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                <Network className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">API & Veri Entegrasyonu</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Gündem, finans veya haber verilerini API üzerinden kendi platformunuza çekin. Zengin içerik akışı ile kullanıcılarınızı besleyin.
                            </p>
                            <ul className="space-y-2 text-sm text-zinc-600 mb-6">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Gerçek zamanlı haber akışı</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Yapay zeka özetleri</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Sentiment analiz verileri</li>
                            </ul>
                        </div>

                        {/* Media Partnership */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-pink-500/30 transition-colors group">
                            <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                                <Newspaper className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Medya Partnerliği</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Kurumsal markanızın hikayesini D4ily kitlelerine ulaştırın. Sponsorlu içerikler ve özel bülten çalışmaları yapalım.
                            </p>
                            <ul className="space-y-2 text-sm text-zinc-600 mb-6">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Sponsorlu bültenler</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Özel röportaj serileri</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Etkinlik sponsorlukları</li>
                            </ul>
                        </div>

                        {/* Strategic Growth */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
                            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Stratejik Büyüme</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                Startuplar ve teknoloji şirketleri için özel büyüme kurguları. Birlikte kampanya ve ürün lansmanları planlayalım.
                            </p>
                            <ul className="space-y-2 text-sm text-zinc-600 mb-6">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Ortak ürün lansmanı</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Cross-marketing</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Banner */}
                <section className="container mx-auto px-4 max-w-6xl">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Farklı Bir Fikriniz mi Var?</h2>
                            <p className="text-indigo-200 text-lg md:text-xl mb-10 leading-relaxed">
                                Standart modellerin dışında, yenilikçi her türlü işbirliği fikrine açığız. Bize projenizden bahsedin.
                            </p>
                            <Link href="/iletisim?subject=partnership" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-950 rounded-full font-bold hover:bg-zinc-100 transition-colors shadow-xl">
                                İletişime Geçin
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
