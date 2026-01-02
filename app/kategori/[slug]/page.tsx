
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { getDigestsByCategory } from "@/lib/digest-data"
import ArchiveClient from "@/components/archive-client"
import { notFound } from "next/navigation"

export const revalidate = 3600

const CATEGORY_MAP: Record<string, { dbKey: string, label: string }> = {
    "siyaset": { dbKey: "politics", label: "Siyaset" },
    "ekonomi": { dbKey: "economy", label: "Ekonomi" },
    "spor": { dbKey: "sports", label: "Spor" },
    "gundem": { dbKey: "gundem", label: "Gündem" } // Fallback
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const info = CATEGORY_MAP[params.slug.toLowerCase()];
    if (!info) return { title: "Kategori Bulunamadı" };

    return {
        title: `${info.label} Haberleri - D4ily Arşivi`,
        description: `D4ily arşivindeki tüm ${info.label.toLowerCase()} haberleri ve günlük özetler.`,
        alternates: {
            canonical: `https://d4ily.com/kategori/${params.slug}`
        }
    }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const slug = params.slug.toLowerCase();
    const info = CATEGORY_MAP[slug];

    if (!info) {
        notFound();
    }

    const initialDigests = await getDigestsByCategory(info.dbKey);

    const archiveItems = initialDigests.map((digest) => ({
        id: digest.id,
        label: info.label, // Force label to match category
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
        category: info.dbKey,
        coverImage: digest.cover_image_url
    }));

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />

            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
                <header className="mb-8 animate-fade-in">
                    <div className="mb-3 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        Kategori Filtresi
                    </div>
                    <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">{info.label} Arşivi</h1>
                    <p className="text-sm text-gray-600 sm:text-base">
                        {archiveItems.length > 0
                            ? `Toplam ${archiveItems.length} adet ${info.label.toLowerCase()} bülteni listeleniyor.`
                            : `Henüz bu kategoride bülten bulunmuyor.`}
                    </p>
                </header>

                <ArchiveClient
                    items={archiveItems}
                    initialCategory={info.dbKey}
                />
            </main>

            <Footer />
        </div>
    )
}
