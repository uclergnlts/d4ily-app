import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, type InferSelectModel } from "drizzle-orm";
import { Calendar, Eye, Share2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

type BlogPost = InferSelectModel<typeof blogPosts>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    const post = posts[0] as BlogPost | undefined;

    if (!post) {
        return {
            title: "Yazı Bulunamadı - D4ily",
        };
    }

    return {
        title: `${post.title} - D4ily Blog`,
        description: post.excerpt || post.content.slice(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.slice(0, 160),
            images: post.cover_image_url ? [post.cover_image_url] : [],
            type: "article",
            publishedTime: post.published_at || post.created_at,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    const post: any = posts[0];

    if (!post) {
        notFound();
    }

    // Ensure type safety for topic relation if defined in schema relations, otherwise we might need a join or manual query
    // Assuming 'with: { topic: true }' works if relations are defined.
    // If not defined in schema relations, I should check schema.ts relations.
    // I didn't add relations definition in schema.ts yet.

    // Quick fix: Fetch topic manually if needed or just display without topic name for now to avoid errors if relations aren't set up.
    // Or I can add relations to schema.ts.
    // Let's stick to safe simple query + manual topic name fetch or just skip topic name for MVP.
    // Actually, I'll update schema.ts for relations later. For now, I will remove `with: { topic: true }` and just rely on `post`.

    // structured data
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || post.content.slice(0, 160),
        image: post.cover_image_url ? [post.cover_image_url] : [],
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
            "@type": "Organization",
            name: "D4ily",
            url: "https://d4ily.com"
        },
        publisher: {
            "@type": "Organization",
            name: "D4ily",
            logo: {
                "@type": "ImageObject",
                url: "https://d4ily.com/icons/icon-512x512.jpg"
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://d4ily.com/blog/${post.slug}`
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <Navigation />

            <main className="flex-1 w-full pt-20 pb-16">
                <article className="container mx-auto px-4 max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Blog&apos;a Dön
                        </Link>

                        <h1 className="text-3xl md:text-5xl font-black font-serif leading-tight mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between py-4 border-y border-border/50">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                {/* 
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {post.view_count} okunma
                </span>
                */}
                            </div>
                            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <Share2 className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {post.cover_image_url && (
                        <div className="rounded-xl overflow-hidden mb-10 aspect-video relative bg-muted">
                            <Image
                                src={post.cover_image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 960px"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert prose-blue max-w-none">
                        <ReactMarkdown>{String(post.content || "")}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags && (() => {
                        try {
                            const tags = JSON.parse(post.tags as string);
                            if (Array.isArray(tags) && tags.length > 0) {
                                return (
                                    <div className="mt-12 pt-6 border-t border-border">
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag: string) => (
                                                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        } catch (e) { return null }
                    })()}

                </article>
            </main>

            <Footer />
        </div>
    );
}
