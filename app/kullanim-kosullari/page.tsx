import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export const metadata = {
    title: "Kullanım Koşulları - D4ily",
    description: "D4ily web sitesi kullanım koşulları ve şartları.",
}

export default function TermsPage() {
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
                        <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-serif">Kullanım Koşulları</h1>
                        <p className="text-muted-foreground">Son güncelleme: Aralık 2024</p>
                    </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2>1. Kabul</h2>
                        <p>
                            D4ily web sitesini ("Site") kullanarak bu Kullanım Koşullarını kabul etmiş olursunuz.
                            Bu koşulları kabul etmiyorsanız, lütfen Siteyi kullanmayınız.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>2. Hizmet Tanımı</h2>
                        <p>
                            D4ily, Türkiye gündeminin yapay zeka destekli özetlerini sunan bir haber platformudur.
                            Hizmetlerimiz:
                        </p>
                        <ul>
                            <li>Günlük ve haftalık haber özetleri</li>
                            <li>Sesli özet (podcast)</li>
                            <li>Canlı Twitter akışı</li>
                            <li>Haber arşivi</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2>3. Fikri Mülkiyet</h2>
                        <p>
                            Sitedeki tüm içerikler (metin, görsel, logo, tasarım) D4ily'nin fikri mülkiyetidir.
                            İçeriklerin izinsiz kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.
                        </p>
                        <p>
                            Haber özetleri, çeşitli kaynaklardan derlenen bilgilerin yapay zeka tarafından
                            işlenmesiyle oluşturulmaktadır. Orijinal haber kaynakları ilgili içeriklerde belirtilmektedir.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>4. Kullanıcı Yükümlülükleri</h2>
                        <p>Siteyi kullanırken:</p>
                        <ul>
                            <li>Yürürlükteki yasalara uygun davranmayı</li>
                            <li>Siteye zarar verecek faaliyetlerde bulunmamayı</li>
                            <li>İçerikleri yasadışı amaçlarla kullanmamayı</li>
                            <li>Diğer kullanıcıların haklarına saygı göstermeyi</li>
                        </ul>
                        <p>kabul edersiniz.</p>
                    </section>

                    <section className="mb-8">
                        <h2>5. Sorumluluk Sınırlaması</h2>
                        <p>
                            D4ily, sunulan içeriklerin doğruluğu konusunda güvence vermemektedir.
                            İçerikler yalnızca bilgilendirme amaçlıdır ve yatırım, hukuki veya tıbbi tavsiye
                            niteliği taşımamaktadır.
                        </p>
                        <p>
                            Site kullanımından doğabilecek doğrudan veya dolaylı zararlardan D4ily sorumlu tutulamaz.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>6. Hizmet Değişiklikleri</h2>
                        <p>
                            D4ily, hizmetlerini önceden haber vermeksizin değiştirme, askıya alma veya
                            sonlandırma hakkını saklı tutar.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>7. Uygulanacak Hukuk</h2>
                        <p>
                            Bu Kullanım Koşulları Türkiye Cumhuriyeti yasalarına tabidir.
                            Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>
                    </section>

                    <section className="bg-muted/50 rounded-xl p-6">
                        <h3 className="font-bold mb-2">İletişim</h3>
                        <p className="text-sm text-muted-foreground m-0">
                            Sorularınız için:{" "}
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
