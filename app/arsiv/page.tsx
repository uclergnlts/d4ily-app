import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { getArchiveDigests } from "@/lib/digest-data"
import ArchiveClient from "@/components/archive-client"
import Link from "next/link"

export const revalidate = 3600

const pageData = {
  archiveLabel: "Geçmiş Özetler",
  archiveTitle: "Arşiv",
  archiveDescription: "Son 30 günün özetlerine göz atın",
}

export default async function ArsivPage() {
  const initialDigests = await getArchiveDigests()

  const archiveItems = initialDigests.map((digest) => ({
    id: digest.id,
    label: "Gündem",
    title: digest.title || `Gündem – ${digest.digest_date}`,
    summary: digest.intro || digest.content.slice(0, 150) + "...",
    date: new Date(digest.digest_date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    readingTime: `${Math.max(1, Math.ceil((digest.content || "").split(" ").length / 200))} dk`,
    href: "/" + digest.digest_date,
    digest_date: digest.digest_date,
    category: "all",
    coverImage: digest.cover_image_url
  }))

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "D4ily Arşiv - Geçmiş Gündem Özetleri",
    description: "Geçmiş günlerin Türkiye gündem özetlerine göz atın.",
    url: "https://d4ily.com/arsiv",
    inLanguage: "tr-TR",
    numberOfItems: archiveItems.length,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://d4ily.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Arşiv",
        item: "https://d4ily.com/arsiv",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navigation />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <header className="mb-8 animate-fade-in">
          <div className="mb-3 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {pageData.archiveLabel}
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">{pageData.archiveTitle}</h1>
          <p className="text-sm text-gray-600 sm:text-base">{pageData.archiveDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/kategori/gundem" className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors">Gündem</Link>
            <Link href="/kategori/siyaset" className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors">Siyaset</Link>
            <Link href="/kategori/ekonomi" className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors">Ekonomi</Link>
            <Link href="/kategori/spor" className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-accent hover:text-accent transition-colors">Spor</Link>
          </div>
        </header>

        <ArchiveClient items={archiveItems} />
      </main>

      <Footer />
    </div>
  )
}
