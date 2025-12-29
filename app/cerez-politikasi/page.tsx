import Link from "next/link"
import { ArrowLeft, Cookie } from "lucide-react"

export const metadata = {
    title: "Çerez Politikası - D4ily",
    description: "D4ily çerez kullanımı ve çerez politikası hakkında bilgi.",
}

export default function CookiePolicyPage() {
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
                        <Cookie className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-serif">Çerez Politikası</h1>
                        <p className="text-muted-foreground">Son güncelleme: Aralık 2024</p>
                    </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2>Çerez Nedir?</h2>
                        <p>
                            Çerezler, web sitelerinin tarayıcınızda sakladığı küçük metin dosyalarıdır.
                            Bu dosyalar, tercihleri hatırlama, kullanım analizi ve reklam kişiselleştirme
                            gibi amaçlarla kullanılır.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>Kullandığımız Çerez Türleri</h2>

                        <h3>1. Zorunlu Çerezler</h3>
                        <p>
                            Web sitesinin temel işlevlerinin çalışması için gereklidir.
                            Bu çerezler olmadan site düzgün çalışmaz.
                        </p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left">Çerez Adı</th>
                                    <th className="text-left">Amacı</th>
                                    <th className="text-left">Süre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>cookie-consent</td>
                                    <td>Çerez tercihlerinizi saklar</td>
                                    <td>1 yıl</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>2. Analiz Çerezleri</h3>
                        <p>
                            Web sitemizin nasıl kullanıldığını anlamamıza yardımcı olur.
                            Toplanan veriler anonimdir.
                        </p>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left">Çerez Adı</th>
                                    <th className="text-left">Amacı</th>
                                    <th className="text-left">Sağlayıcı</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>_ga, _gid</td>
                                    <td>Sayfa görüntüleme ve kullanıcı davranışı analizi</td>
                                    <td>Google Analytics</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="mb-8">
                        <h2>Çerezleri Yönetme</h2>
                        <p>
                            Tarayıcınızın ayarlarından çerezleri kontrol edebilir veya silebilirsiniz:
                        </p>
                        <ul>
                            <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                            <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
                            <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                            <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
                        </ul>
                        <p className="text-sm text-muted-foreground">
                            Not: Çerezleri devre dışı bırakmak, web sitesinin bazı özelliklerinin
                            düzgün çalışmamasına neden olabilir.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2>Üçüncü Taraf Çerezleri</h2>
                        <p>
                            Web sitemiz Google Analytics kullanmaktadır. Google&apos;ın gizlilik uygulamaları
                            hakkında bilgi almak için{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Google Gizlilik Politikası
                            </a>
                            &apos;nı inceleyebilirsiniz.
                        </p>
                    </section>

                    <section className="bg-muted/50 rounded-xl p-6">
                        <h3 className="font-bold mb-2">İletişim</h3>
                        <p className="text-sm text-muted-foreground m-0">
                            Çerez politikamızla ilgili sorularınız için:{" "}
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
