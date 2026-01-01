import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Logo and Description */}
        <div className="mb-12">
          <div className="mb-4">
            <Image src="/images/d4ily-logo.png" alt="D4ily" width={120} height={40} className="mb-2" />
            <p className="text-sm font-medium text-gray-600">4 in 1: Gündem • Analiz • Trend • Özet</p>
          </div>

          <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
            Türkiye gündemini her sabah 5 dakikada öğrenin. Yapay zeka destekli analiz ile doğrulanmış haberler.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {/* Sayfalar */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">Sayfalar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Gündem
                </Link>
              </li>
              <li>
                <Link href="/haberler" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Haberler
                </Link>
              </li>
              <li>
                <Link href="/haftalik-ozet" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Haftalık Özet
                </Link>
              </li>
              <li>
                <Link href="/akis" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Canlı Akış
                </Link>
              </li>
              <li>
                <Link href="/arsiv" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Arşiv
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">Kurumsal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hakkimizda" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kariyer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="/partnerlik" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Partnerlik
                </Link>
              </li>
              <li>
                <Link href="/sorun-bildir" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Sorun Bildir
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">Yasal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/gizlilik" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Gizlilik
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Kullanıcı Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/telif-haklari" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Telif Hakları
                </Link>
              </li>
            </ul>
          </div>

          {/* Daha */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">Daha</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Spotify Podcast
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Apple Podcast
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Yapımcı
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Yatırımcılar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Reklam
                </a>
              </li>
            </ul>
          </div>

          {/* Yararlı Linkler */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">Yararlı Linkler</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Takip Edilen Hesaplar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Takip Edilen Kuruluşlar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Resmi Gazete
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Canlı Döviz
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Hava Durumu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2025 D4ily. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-900">
            <span>500+ Kaynak</span>
            <span>AI Destekli</span>
            <span>Her Sabah 07:00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
