import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Calendar, User, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Blog - D4ily",
    description: "Türkiye gündemi, ekonomi ve teknoloji üzerine derinlemesine analizler ve rehberler.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogIndexPage() {
    const posts = await db.select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.created_at));

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navigation />

            <main className="flex-1 w-full pt-20 md:pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-black font-serif mb-4">D4ily Blog</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Gündemin ötesine geçen analizler, rehberler ve derinlemesine incelemeler.
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-card/50">
                                    <div className="aspect-video relative bg-muted">
                                        {/* Placeholder or Image */}
                                        {post.cover_image_url ? (
                                            <Image
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 1024px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-muted-foreground">
                                                D4ily
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h2 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                            {/* Add read time if available later */}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
                            <h3 className="text-xl font-semibold mb-2">Henüz içerik bulunmuyor</h3>
                            <p className="text-muted-foreground">Blog sistemimiz yeni kuruldu. Çok yakında burası değerli içeriklerle dolacak.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
