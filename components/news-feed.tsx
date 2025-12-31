
import { db } from "@/lib/db";
import { processedArticles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
// @ts-ignore - drizzle-orm type issue
import { unstable_cache } from "next/cache";
import Link from "next/link";
import Image from "next/image";

async function getLatestNews() {
    // 1. Fetch a larger pool of latest news (e.g., 60) to ensure we have enough diversity
    const news = await db
        .select()
        .from(processedArticles)
        .where(eq(processedArticles.is_published, true))
        .orderBy(desc(processedArticles.processed_at))
        .limit(60);

    // 2. Client-side filtering to limit max 2 per source
    const filtered: typeof news = [];
    const sourceCounts: Record<string, number> = {};

    for (const item of news) {
        // Normalize source name roughly to handle minor variations if any
        const source = item.source_name || "Unknown";

        const count = sourceCounts[source] || 0;

        if (count < 2) {
            filtered.push(item);
            sourceCounts[source] = count + 1;
        }

        if (filtered.length >= 12) break;
    }

    return filtered;
}

export default async function NewsFeed() {
    // Cache for 15 minutes
    const getCachedNews = unstable_cache(
        async () => getLatestNews(),
        ['latest-news-feed'],
        { revalidate: 900 }
    );

    const news = await getCachedNews();

    if (news.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span className="w-2 h-8 bg-red-600 rounded-sm"></span>
                        Anlık Haber
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500 font-mono hidden md:flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            AI Destekli • Her saat güncellenir
                        </span>
                        <Link href="/haberler" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                            Tüm Haberler
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {news.map((item) => (
                        <article key={item.id} className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                            <Link href={`/haber/${item.id}`} className="flex flex-col h-full">
                                {item.image_url && (
                                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-sm shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col flex-1 p-5">
                                    <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.source_name}</span>
                                        <span>•</span>
                                        <time dateTime={item.processed_at}>
                                            {new Date(item.processed_at).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                        {item.summary}
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
