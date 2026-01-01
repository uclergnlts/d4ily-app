import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { AlertCircle, Bug, FileWarning, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sorun Bildir - D4ily | Geri Bildirim",
    description: "D4ily deneyiminizi iyileştirmemize yardımcı olun. Teknik hataları, içerik yanlışlarını veya önerilerinizi bize bildirin.",
    keywords: ["d4ily sorun bildir", "hata bildirimi", "geri bildirim", "destek", "teknik sorun"],
    openGraph: {
        title: "Sorun Bildir - D4ily",
        description: "Daha iyi bir deneyim için geri bildirimleriniz bizim için önemli.",
        type: "website",
        url: "https://d4ily.com/sorun-bildir",
    },
    alternates: {
        canonical: "https://d4ily.com/sorun-bildir",
    },
}

export default function ReportIssuePage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow pt-8 pb-16 md:pt-12 md:pb-24">
                {/* Hero Section */}
                <section className="relative mb-20 md:mb-28 overflow-hidden px-4">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="container mx-auto max-w-4xl text-center pt-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <AlertCircle className="h-3 w-3" />
                            Geri Bildirim Merkezi
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Daha İyi Bir D4ily İçin <br /><span className="text-primary italic">Yardımınıza İhtiyacımız Var</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            Karşılaştığınız hataları veya aklınıza gelen parlak fikirleri bizimle paylaşın. Her geri bildirim, platformu geliştirmemiz için bir fırsattır.
                        </p>
                    </div>
                </section>

                {/* Reporting Options */}
                <section className="container mx-auto px-4 max-w-6xl mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Technical Bug */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-red-500/30 transition-colors group flex flex-col">
                            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
                                <Bug className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Teknik Hata</h3>
                            <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                Sayfa yüklenmiyor mu? Bir buton çalışmıyor mu? Görsel hatalar mı var? Teknik sorunları detaylıca bize iletin.
                            </p>
                            <Link href="/iletisim?subject=hata_bildirimi" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors group-hover:shadow-sm">
                                Hata Bildir <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Content Issue */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-amber-500/30 transition-colors group flex flex-col">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                                <FileWarning className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">İçerik Hatası</h3>
                            <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                Haberlerde bir yanlışlık mı fark ettiniz? Yazım yanlışı veya yanlış bilgi mi var? İçerik ekibimize bildirin.
                            </p>
                            <Link href="/iletisim?subject=icerik_hatasi" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-50 text-amber-600 font-medium hover:bg-amber-100 transition-colors group-hover:shadow-sm">
                                Düzeltme Öner <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Suggestion */}
                        <div className="bg-card border border-border p-8 rounded-3xl hover:border-blue-500/30 transition-colors group flex flex-col">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Lightbulb className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Öneri & Fikir</h3>
                            <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                "Şöyle bir özellik olsa harika olurdu" dediğiniz ne varsa, duymak istiyoruz. D4ily'yi birlikte şekillendirelim.
                            </p>
                            <Link href="/iletisim?subject=oneri" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors group-hover:shadow-sm">
                                Fikir Paylaş <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Bug Bounty / Security Note */}
                <section className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-zinc-900 text-zinc-300 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-zinc-800">
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-white mb-3">Güvenlik Bildirimi</h3>
                            <p className="mb-6 leading-relaxed">
                                Eğer bir güvenlik zafiyeti keşfettiyseniz, lütfen bunu doğrudan güvenlik ekibimize bildirin. Güvenlik bildirimlerini en yüksek öncelikle değerlendiriyoruz.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>24 saat içinde ilk yanıt garantisi</span>
                            </div>
                        </div>
                        <Link href="/iletisim?subject=guvenlik" className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-colors whitespace-nowrap">
                            Güvenlik Ekibine Yaz
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
