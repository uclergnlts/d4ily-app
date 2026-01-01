import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Copyright } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Telif Hakları - D4ily",
    description: "D4ily telif hakları politikası ve içerik kullanım şartları.",
}

export default function CopyrightPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                            <Copyright className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-serif">Telif Hakları</h1>
                            <p className="text-muted-foreground">Son güncelleme: Ocak 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <section className="mb-8">
                            <h2>İçerik Mülkiyeti</h2>
                            <p>
                                D4ily (&quot;Platform&quot;) üzerinde yayınlanan tüm metinler, grafikler, kullanıcı arayüzleri, görsel arayüzler,
                                fotoğraflar, ticari markalar, logolar, sesler, müzikler, sanat eserleri ve bilgisayar kodları
                                (topluca &quot;İçerik&quot;), D4ily&apos;ye aittir, denetlenmektedir veya lisanslanmıştır.
                                Bu içerikler, telif hakkı, patent ve ticari marka yasaları ile diğer fikri mülkiyet hakları
                                ve haksız rekabet yasaları tarafından korunmaktadır.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>Kullanım İzni</h2>
                            <p>
                                Platformumuzdaki içerikleri yalnızca kişisel ve ticari olmayan amaçlarla görüntüleyebilir,
                                indirebilir ve yazdırabilirsiniz. Aşağıdaki durumlar haricinde, D4ily&apos;nin açık yazılı izni olmaksızın
                                hiçbir içerik kopyalanamaz, çoğaltılamaz, yeniden yayınlanamaz, yüklenemez, gönderilemez,
                                halka açık olarak sergilenemez, kodlanamaz, tercüme edilemez veya herhangi bir şekilde dağıtılamaz:
                            </p>
                            <ul>
                                <li>
                                    <strong>Alıntılama:</strong> Kaynak (D4ily.com) ve eğer varsa yazar adı açıkça belirtilerek
                                    ve orijinal içeriğe aktif link verilerek makul ölçüde kısa alıntılar yapılabilir.
                                </li>
                                <li>
                                    <strong>Sosyal Medya Paylaşımı:</strong> Platform üzerindeki paylaşım butonları aracılığıyla
                                    veya doğrudan link paylaşarak içerikler sosyal medyada yayılabilir.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2>İhlal Bildirimi</h2>
                            <p>
                                Eğer Platformumuzda yer alan herhangi bir içeriğin telif haklarınızı ihlal ettiğini düşünüyorsanız,
                                lütfen bize bildirin. Bildiriminizde aşağıdaki bilgilerin yer alması süreci hızlandıracaktır:
                            </p>
                            <ul>
                                <li>Telif hakkı sahibi veya yetkili temsilcisinin iletişim bilgileri</li>
                                <li>İhlal edildiği iddia edilen eserin tanımı</li>
                                <li>İhlal eden materyalin URL&apos;si veya konumu</li>
                                <li>İyi niyetli bir hata olduğuna dair beyan</li>
                            </ul>
                        </section>

                        <section className="bg-muted/50 rounded-xl p-6 border border-border">
                            <h3 className="font-bold mb-2 mt-0">İletişim</h3>
                            <p className="text-sm text-muted-foreground m-0">
                                Telif hakkı bildirimleri için:{" "}
                                <a href="mailto:legal@d4ily.com" className="text-primary hover:underline">
                                    legal@d4ily.com
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
