import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { FileText } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "KVKK Aydınlatma Metni - D4ily",
    description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
}

export default function KVKKPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Header />

            <main className="flex-grow py-12 md:py-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-serif">KVKK Aydınlatma Metni</h1>
                            <p className="text-muted-foreground">Son güncelleme: Ocak 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="lead">
                            D4ily olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
                            kişisel verilerinizin güvenliği ve gizliliğine önem veriyoruz.
                        </p>

                        <section className="mb-8">
                            <h2>1. Veri Sorumlusu</h2>
                            <p>
                                KVKK kapsamında veri sorumlusu sıfatıyla hareket eden D4ily yönetimi,
                                kişisel verilerinizi aşağıda açıklanan amaçlar doğrultusunda işlemektedir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>2. Kişisel Verilerin İşlenme Amacı</h2>
                            <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                            <ul>
                                <li>Hizmetlerimizin sunulması ve kalitesinin artırılması</li>
                                <li>Kullanıcı deneyiminin iyileştirilmesi</li>
                                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                <li>İletişim faaliyetlerinin yürütülmesi</li>
                                <li>Bilgi güvenliği süreçlerinin yürütülmesi</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2>3. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
                            <p>
                                Kişisel verileriniz, web sitemiz, mobil uygulamalarımız, e-posta ve iletişim formları aracılığıyla
                                elektronik ortamda toplanmaktadır. Bu veriler, KVKK&apos;nın 5. ve 6. maddelerinde belirtilen
                                hukuki sebeplere dayanarak işlenmektedir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>4. Kişisel Verilerin Aktarılması</h2>
                            <p>
                                Kişisel verileriniz, yasal zorunluluklar haricinde ve açık rızanız olmaksızın üçüncü kişilerle paylaşılmamaktadır.
                                Ancak, hizmet sağlayıcılarımız (sunucu barındırma, e-posta gönderimi vb.) ile gerekli güvenlik önlemleri alınarak paylaşılabilir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2>5. Veri Sahibi Olarak Haklarınız</h2>
                            <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                            <ul>
                                <li>Kişisel veri işlenip işlenmediğini öğrenme</li>
                                <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme</li>
                                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                                <li>KVKK 7. maddede öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
                            </ul>
                        </section>

                        <section className="bg-muted/50 rounded-xl p-6 border border-border">
                            <h3 className="font-bold mb-2 mt-0">Başvuru</h3>
                            <p className="text-sm text-muted-foreground m-0">
                                KVKK kapsamındaki haklarınızı kullanmak ve taleplerinizi iletmek için{" "}
                                <a href="mailto:kvkk@d4ily.com" className="text-primary hover:underline">
                                    kvkk@d4ily.com
                                </a>{" "}
                                adresine e-posta gönderebilirsiniz.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
