"use client";

import { useState } from "react";
import Link from "next/link";
import { getMoreNews } from "@/app/actions/news";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NewsItem {
    id: number;
    title: string;
    summary: string;
    image_url: string | null;
    source_name: string | null; // Allow null as per schema
    category: string | null;    // Allow null as per schema
    published_at: string | null; // Allow null
    processed_at: string;
    is_published: boolean;
}

interface NewsFeedProps {
    initialNews: NewsItem[];
}

export function NewsFeed({ initialNews }: NewsFeedProps) {
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [page, setPage] = useState(2); // Start from page 2 since page 1 is initial
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const newNews = await getMoreNews(page);
            if (newNews.length === 0) {
                setHasMore(false);
            } else {
                setNews([...news, ...newNews]);
                setPage(page + 1);
                // If we got fewer items than requested, likely no more left
                if (newNews.length < 12) { // Matching ITEMS_PER_PAGE from server action
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Failed to load more news:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {news.map((item) => (
                    <article
                        key={item.id}
                        className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                    >
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
                                        {new Date(item.processed_at).toLocaleTimeString("tr-TR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
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

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        onClick={loadMore}
                        disabled={isLoading}
                        size="lg"
                        variant="outline"
                        className="min-w-[200px] font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            "Daha Fazla Göster"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
