import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Cookie } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Çerez Politikası - D4ily",
    description: "D4ily çerez kullanımı ve tercihlerinizi nasıl yönetebileceğiniz hakkında bilgiler.",
}

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
                            <Cookie className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-serif">Çerez Politikası</h1>
                            <p className="text-muted-foreground">Son güncelleme: Ocak 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2>Çerez Nedir?</h2>
                            <p>
                                Çerezler (cookies), web sitelerini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilen
                                küçük metin dosyalarıdır. Bu dosyalar, sitenin tercihlerinizi hatırlamasını ve size daha iyi bir
                                deneyim sunmasını sağlar.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>Hangi Çerezleri Kullanıyoruz?</h2>

                            <div className="space-y-4 my-6">
                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <h3 className="text-lg font-bold mt-0 mb-2">Zorunlu Çerezler</h3>
                                    <p className="mb-0 text-sm">
                                        Web sitesinin düzgün çalışması için gereklidir. Bu çerezler olmadan sitenin bazı bölümleri kullanılamaz.
                                    </p>
                                </div>

                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <h3 className="text-lg font-bold mt-0 mb-2">Analitik Çerezler</h3>
                                    <p className="mb-0 text-sm">
                                        Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur (örn. Google Analytics).
                                        Bu veriler anonim olarak toplanır.
                                    </p>
                                </div>

                                <div className="border border-border rounded-lg p-4 bg-muted/20">
                                    <h3 className="text-lg font-bold mt-0 mb-2">Fonksiyonel Çerezler</h3>
                                    <p className="mb-0 text-sm">
                                        Tercihlerinizi (örneğin dil seçimi veya karanlık mod) hatırlamamızı sağlar.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2>Çerezleri Nasıl Yönetebilirsiniz?</h2>
                            <p>
                                Çoğu web tarayıcısı çerezleri otomatik olarak kabul eder, ancak tarayıcı ayarlarınızı değiştirerek
                                çerezleri reddedebilir veya silebilirsiniz. Ancak, çerezleri devre dışı bırakmanız durumunda
                                web sitemizin bazı özellikleri düzgün çalışmayabilir.
                            </p>
                            <ul>
                                <li>Chrome: Ayarlar {'>'} Gizlilik ve Güvenlik {'>'} Çerezler</li>
                                <li>Firefox: Seçenekler {'>'} Gizlilik ve Güvenlik {'>'} Çerezler</li>
                                <li>Safari: Tercihler {'>'} Gizlilik {'>'} Çerezler</li>
                            </ul>
                        </section>

                        <section className="bg-muted/50 rounded-xl p-6 border border-border">
                            <h3 className="font-bold mb-2 mt-0">İletişim</h3>
                            <p className="text-sm text-muted-foreground m-0">
                                Çerez politikamızla ilgili sorularınız için:{" "}
                                <a href="mailto:info@d4ily.com" className="text-primary hover:underline">
                                    info@d4ily.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
