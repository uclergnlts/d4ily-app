
import { db } from "@/lib/db";
import { newsRaw, processedArticles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, BookOpen } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getArticle(id: number) {
    const result = await db
        .select({
            id: processedArticles.id,
            title: processedArticles.title,
            summary: processedArticles.summary,
            category: processedArticles.category,
            image_url: processedArticles.image_url,
            source_name: processedArticles.source_name,
            published_at: processedArticles.published_at,
            original_url: newsRaw.url,
        })
        .from(processedArticles)
        .leftJoin(newsRaw, eq(processedArticles.original_news_id, newsRaw.id))
        .where(eq(processedArticles.id, id))
        .get();

    return result;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) return { title: "Haber Bulunamadı" };

    const article = await getArticle(id);

    if (!article) {
        return {
            title: "Haber Bulunamadı - D4ily",
        };
    }

    return {
        title: `${article.title} - D4ily`,
        description: article.summary.substring(0, 160),
        openGraph: {
            title: article.title,
            description: article.summary.substring(0, 160),
            images: article.image_url ? [article.image_url] : [],
        },
    };
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) {
        notFound();
    }

    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    const date = new Date(article.published_at || new Date());

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Nav */}
            <div className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>

            <article className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {article.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={article.published_at || ""}>
                            {date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </time>
                    </div>
                    <span>•</span>
                    <span className="font-medium text-foreground">{article.source_name}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-8 text-foreground">
                    {article.title}
                </h1>

                {/* Cover Image */}
                {article.image_url && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 border border-border/50 shadow-sm">
                        <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            sizes="(min-width: 1024px) 960px, 100vw"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                {/* AI Summary Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="bg-secondary/30 border-l-4 border-primary p-6 rounded-r-xl mb-8">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground m-0 mb-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            AI Özeti
                        </h3>
                        <p className="text-muted-foreground m-0 leading-relaxed">
                            {article.summary}
                        </p>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        Bu içerik yapay zeka tarafından özetlenmiştir. Detaylar için kaynağı ziyaret edin.
                    </p>

                    {article.original_url && (
                        <a
                            href={article.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-transform hover:scale-105 shadow-lg"
                        >
                            Kaynağa Git
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>

            </article>
        </div>
    );
}
