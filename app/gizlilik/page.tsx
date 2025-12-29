import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export const metadata = {
    title: "Gizlilik Politikası - D4ily",
    description: "D4ily gizlilik politikası ve kişisel verilerin korunması hakkında bilgilendirme.",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Ana Sayfaya Dön
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-serif">Gizlilik Politikası</h1>
                        <p className="text-muted-foreground">Son güncelleme: Aralık 2024</p>
                    </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2>1. Genel Bilgi</h2>
                        <p>
                            D4ily (&quot;biz&quot;, &quot;bizim&quot; veya &quot;Platform&quot;) olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizi
                            korumak için gerekli önlemleri alıyoruz. Bu Gizlilik Politikası, web sitemizi kullandığınızda
                            hangi bilgileri topladığımızı ve bu bilgileri nasıl kullandığımızı açıklamaktadır.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>2. Toplanan Bilgiler</h2>
                        <h3>2.1 Otomatik Toplanan Bilgiler</h3>
                        <ul>
                            <li>IP adresi</li>
                            <li>Tarayıcı türü ve sürümü</li>
                            <li>Ziyaret edilen sayfalar ve süreleri</li>
                            <li>Cihaz bilgileri</li>
                        </ul>

                        <h3>2.2 Kullanıcı Tarafından Sağlanan Bilgiler</h3>
                        <ul>
                            <li>E-posta bülteni aboneliği için e-posta adresi</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2>3. Bilgilerin Kullanımı</h2>
                        <p>Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
                        <ul>
                            <li>Hizmetlerimizi sunmak ve iyileştirmek</li>
                            <li>Web sitesi performansını analiz etmek</li>
                            <li>E-posta bültenlerimizi göndermek (izin verilmişse)</li>
                            <li>Güvenlik ve dolandırıcılık önleme</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2>4. Üçüncü Taraf Hizmetleri</h2>
                        <p>Aşağıdaki üçüncü taraf hizmetlerini kullanıyoruz:</p>
                        <ul>
                            <li><strong>Google Analytics:</strong> Web sitesi trafiğini analiz etmek için</li>
                            <li><strong>Vercel:</strong> Web sitesi barındırma için</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2>5. Çerezler</h2>
                        <p>
                            Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır.
                            Çerez kullanımı hakkında detaylı bilgi için{" "}
                            <Link href="/cerez-politikasi" className="text-primary hover:underline">
                                Çerez Politikası
                            </Link>{" "}
                            sayfamızı ziyaret edebilirsiniz.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>6. Veri Güvenliği</h2>
                        <p>
                            Kişisel verilerinizi yetkisiz erişim, değişiklik, ifşa veya imhadan korumak için
                            endüstri standardı güvenlik önlemleri uyguluyoruz.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>7. Haklarınız</h2>
                        <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                        <ul>
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                            <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                            <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                            <li>Verilerin silinmesini veya yok edilmesini isteme</li>
                        </ul>
                    </section>

                    <section className="bg-muted/50 rounded-xl p-6">
                        <h3 className="font-bold mb-2">İletişim</h3>
                        <p className="text-sm text-muted-foreground m-0">
                            Gizlilik ile ilgili sorularınız için:{" "}
                            <a href="mailto:info@d4ily.com" className="text-primary hover:underline">
                                info@d4ily.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
