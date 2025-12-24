import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { getArchiveDigestsByMonth, formatDateShort, countWords } from "@/lib/digest-data"
import { Calendar, Clock } from "lucide-react"

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { year: string; month: string } }): Promise<Metadata> {
  const { year, month } = params
  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]
  const monthName = monthNames[Number.parseInt(month) - 1] || month

  return {
    title: `${monthName} ${year} Arşivi - Türkiye Gündemi | D4ily`,
    description: `${monthName} ${year} ayına ait tüm Türkiye gündem özetleri. Günlük haberler, analizler ve sesli özetler.`,
    alternates: {
      canonical: `https://d4ily.com/arsiv/${year}/${month}`,
    },
    openGraph: {
      title: `${monthName} ${year} Arşivi | D4ily`,
      description: `${monthName} ${year} ayına ait tüm gündem özetleri`,
      url: `https://d4ily.com/arsiv/${year}/${month}`,
      type: "website",
    },
  }
}

export default async function MonthArchivePage({ params }: { params: { year: string; month: string } }) {
  const { year, month } = params
  const digests = await getArchiveDigestsByMonth(year, month)

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ]
  const monthName = monthNames[Number.parseInt(month) - 1] || month

  const archiveItems = digests.map((digest) => ({
    id: digest.id,
    title: digest.title || `Gündem – ${digest.digest_date}`,
    summary: digest.intro || digest.content.slice(0, 150) + "...",
    date: formatDateShort(digest.digest_date),
    readingTime: `${Math.max(1, Math.ceil(countWords(digest.content) / 200))} dk`,
    href: `/turkiye-gundemi-${digest.digest_date}`,
  }))

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://d4ily.com" },
      { "@type": "ListItem", position: 2, name: "Arşiv", item: "https://d4ily.com/arsiv" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${monthName} ${year}`,
        item: `https://d4ily.com/arsiv/${year}/${month}`,
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <header className="mb-8 animate-fade-in">
          <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            {monthName} {year} Arşivi
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">{archiveItems.length} gündem özeti</p>
        </header>

        {archiveItems.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Bu ay için henüz özet bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {archiveItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="group block rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h2 className="mb-2 font-serif text-lg font-semibold text-gray-900 transition-colors group-hover:text-accent sm:text-xl">
                  {item.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">{item.summary}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-400" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {item.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
