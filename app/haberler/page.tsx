
import { db } from "@/lib/db";
import { processedArticles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getAllNews() {
    return await db
        .select()
        .from(processedArticles)
        .where(eq(processedArticles.is_published, true))
        .orderBy(desc(processedArticles.processed_at))
        .limit(100);
}

export const metadata = {
    title: "Tüm Haberler - D4ily",
    description: "Güncel haberlerin tamamı.",
};

export const revalidate = 900; // 15 mins

export default async function NewsPage() {
    const news = await getAllNews();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Nav */}
            <div className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Ana Sayfaya Dön
                    </Link>
                    <h1 className="font-serif font-bold text-lg">Tüm Haberler</h1>
                    <div className="w-8"></div> {/* Spacer for centering if needed */}
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {news.map((item) => (
                        <article key={item.id} className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                            <Link href={`/haber/${item.id}`} className="flex flex-col h-full">
                                {item.image_url && (
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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
                                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">{item.source_name}</span>
                                        <span>•</span>
                                        <time dateTime={item.processed_at}>
                                            {new Date(item.processed_at).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                        {item.summary}
                                    </p>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
