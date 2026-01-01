import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Rocket, Heart, Zap, Globe, Users, Coffee, ArrowRight, Briefcase } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kariyer - D4ily | Bize Katılın",
    description: "D4ily ekibine katılın ve dijital haberciliğin geleceğini birlikte inşa edelim. Açık pozisyonlar ve çalışma kültürümüz hakkında bilgi alın.",
    keywords: ["d4ily kariyer", "d4ily iş ilanları", "teknoloji işleri", "uzaktan çalışma", "startup kariyer"],
    openGraph: {
        title: "Kariyer - D4ily",
        description: "Geleceği birlikte inşa ediyoruz. D4ily ekibine katılın.",
        type: "website",
        url: "https://d4ily.com/kariyer",
    },
    alternates: {
        canonical: "https://d4ily.com/kariyer",
    },
}

export default function CareerPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow pt-8 pb-16 md:pt-12 md:pb-24">
                {/* Hero Section */}
                <section className="relative mb-20 md:mb-32 overflow-hidden px-4">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-5xl text-center pt-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Rocket className="h-3 w-3" />
                            Kariyer Fırsatları
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Geleceği <span className="text-primary italic">Birlikte</span><br />İnşa Edelim
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            D4ily olarak haberciliği yapay zeka ile yeniden tanımlıyoruz. Bu heyecan verici yolculukta bize katılacak tutkulu takım arkadaşları arıyoruz.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <a href="#positions" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                                Açık Pozisyonlar <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Culture / Values */}
                <section className="container mx-auto px-4 max-w-6xl mb-24 md:mb-32">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-blue-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Hızlı ve Çevik</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Startup ruhunu koruyor, hızlı karar alıyor ve uyguluyoruz. Bürokrasiden uzak, etki odaklı çalışıyoruz.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">İnsan Odaklı</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Teknolojiyi geliştirirken insanı odağımıza alıyoruz. Takım arkadaşlarımızın mutluluğu ve gelişimi önceliğimiz.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-green-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Global Vizyon</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yerel başlayıp global düşünüyoruz. Sınırları zorluyor ve dünya standartlarında işler üretiyoruz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="container mx-auto px-4 max-w-6xl mb-24 md:mb-32">
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-10 md:p-16 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Burada <br />Neler Var?</h2>
                                <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                                    D4ily&apos;de çalışırken sadece iş yapmazsınız, kendinizi geliştirir ve harika avantajlardan yararlanırsınız.
                                </p>
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">Uzaktan Çalışma Özgürlüğü</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <Coffee className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">Esnek Çalışma Saatleri</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">Modern Teknoloji Stack&apos;i</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 opacity-80">
                                    <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
                                        <div className="text-4xl font-bold text-primary mb-1">₺</div>
                                        <div className="text-sm text-zinc-400">Rekabetçi Maaş</div>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm translate-y-8">
                                        <div className="text-4xl font-bold text-blue-500 mb-1">🏥</div>
                                        <div className="text-sm text-zinc-400">Özel Sağlık Sigortası</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section id="positions" className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif mb-12 text-center">Açık Pozisyonlar</h2>

                    <div className="space-y-4">
                        {/* Example Position - Can be dynamic later */}
                        <div className="bg-card border border-border p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/50 transition-colors cursor-pointer">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Full Stack Developer</h3>
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">Yeni</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Tam Zamanlı</span>
                                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Uzaktan (Remote)</span>
                                </div>
                            </div>
                            <Link href="/iletisim?subject=is_basvurusu" className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-xl font-medium transition-colors text-center whitespace-nowrap">
                                Başvur
                            </Link>
                        </div>

                        <div className="bg-card border border-border p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/50 transition-colors cursor-pointer">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">AI Engineer</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Tam Zamanlı</span>
                                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Uzaktan / İstanbul</span>
                                </div>
                            </div>
                            <Link href="/iletisim?subject=is_basvurusu" className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-xl font-medium transition-colors text-center whitespace-nowrap">
                                Başvur
                            </Link>
                        </div>

                        {/* Empty State / General Application */}
                        <div className="mt-12 p-8 rounded-3xl bg-muted/30 border border-dashed border-border text-center">
                            <h3 className="text-lg font-bold mb-2">Aradığınız pozisyonu bulamadınız mı?</h3>
                            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                Yetenekli insanlarla tanışmayı her zaman isteriz. Genel başvurunuzu yaparak veritabanımıza katılabilirsiniz.
                            </p>
                            <Link href="/iletisim?subject=genel_basvuru" className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-xl font-medium transition-colors">
                                Genel Başvuru Yap
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
