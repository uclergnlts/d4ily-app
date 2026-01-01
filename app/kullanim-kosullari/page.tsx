import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Scale } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Kullanım Koşulları - D4ily",
    description: "D4ily kullanım koşulları ve kullanıcı sözleşmesi.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <Scale className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-serif">Kullanım Koşulları</h1>
                            <p className="text-muted-foreground">Son güncelleme: Ocak 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="lead">
                            D4ily platformunu ziyaret ederek veya kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
                        </p>

                        <section className="mb-8">
                            <h2>1. Hizmetin Kapsamı</h2>
                            <p>
                                D4ily, kullanıcılara günlük haber özetleri, gündem analizleri ve çeşitli içerikler sunan dijital bir platformdur.
                                Hizmetlerimizden yararlanmak için üye olmanız gerekmemektedir, ancak bazı özellikler (bülten aboneliği gibi)
                                kayıt gerektirebilir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>2. Fikri Mülkiyet Hakları</h2>
                            <p>
                                Platform üzerindeki tüm metinler, grafikler, logolar ve yazılımlar D4ily&apos;nin mülkiyetindedir ve telif hakkı
                                kanunları ile korunmaktadır. İçeriklerimiz, kaynak gösterilerek ve ticari olmayan amaçlarla paylaşılabilir.
                                Ancak, içeriğin izinsiz kopyalanması, değiştirilmesi veya ticari amaçla kullanılması yasaktır.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>3. Kullanıcı Sorumlulukları</h2>
                            <ul>
                                <li>Platformu yasalara uygun şekilde kullanmayı kabul edersiniz.</li>
                                <li>Sistem güvenliğini tehlikeye atacak herhangi bir girişimde bulunamazsınız.</li>
                                <li>Diğer kullanıcıların haklarına saygı göstermelisiniz.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2>4. Sorumluluk Reddi</h2>
                            <p>
                                D4ily, sunulan bilgilerin doğruluğu ve güncelliği konusunda azami özeni gösterir, ancak kesin doğruluk garantisi vermez.
                                Platformda yer alan içerikler bilgilendirme amaçlıdır ve yatırım, hukuk veya tıbbi tavsiye niteliği taşımaz.
                                Dış bağlantıların içeriğinden D4ily sorumlu değildir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>5. Değişiklikler</h2>
                            <p>
                                D4ily, bu kullanım koşullarını dilediği zaman önceden bildirmeksizin değiştirme hakkını saklı tutar.
                                Değişiklikler, bu sayfada yayınlandığı tarihte yürürlüğe girer. Düzenli olarak bu sayfayı kontrol etmeniz önerilir.
                            </p>
                        </section>

                        <section className="bg-muted/50 rounded-xl p-6 border border-border">
                            <h3 className="font-bold mb-2 mt-0">İletişim</h3>
                            <p className="text-sm text-muted-foreground m-0">
                                Bu koşullarla ilgili sorularınız için:{" "}
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
