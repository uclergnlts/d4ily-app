
import Image from "next/image";
import { db } from "@/lib/db";
import { topics, blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next"; // Standard Metadata type
import { LayoutDashboard, Calendar, Eye, ArrowRight } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const topic = await db.select().from(topics).where(eq(topics.slug, slug)).get();

  if (!topic) {
    return {
      title: "Konu Bulunamadı | D4ily",
    };
  }

  return {
    title: `${topic.name} ile İlgili En Son Haberler ve Rehberler | D4ily`,
    description: topic.description || `${topic.name} konusu hakkında detaylı analizler, güncel haberler ve kapsamlı rehberler. D4ily ile ${topic.name} gündemini takip edin.`,
    alternates: {
      canonical: `/konu/${slug}`,
    },
    openGraph: {
      title: `${topic.name} - D4ily`,
      description: topic.description || `${topic.name} hakkında her şey.`,
      type: "website",
    }
  };
}

export default async function TopicPage({ params }: PageProps) {
  const slug = params.slug;

  // Fetch Topic
  const topic = await db.select().from(topics).where(eq(topics.slug, slug)).get();

  if (!topic) {
    notFound();
  }

  // Fetch Related Posts
  const posts = await db.select()
    .from(blogPosts)
    .where(eq(blogPosts.topic_id, topic.id))
    .orderBy(desc(blogPosts.created_at))
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {topic.name}
          </h1>
          {/* SEO Description Data (300-500 words per requirement, currently using DB description) */}
          {/* Ideally this would be a long rich text field from the DB. Using description for now. */}
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
            <p>{topic.description || `${topic.name} kategorisindeki en güncel gelişmeler, uzman analizleri ve detaylı rehberler bu sayfada listelenmektedir.`}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            İlgili İçerikler
          </h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Toplam {posts.length} yazı
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group-hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-[1.6/1] overflow-hidden bg-gray-100">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <LayoutDashboard className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                      {topic.name}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}
                      </span>
                      {(post.view_count || 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.view_count}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {post.excerpt || post.meta_description}
                    </p>

                    <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto group/btn">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Henüz içerik yok</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              &quot;{topic.name}&quot; konusu hakkında henüz bir yazı yayınlanmamış. Yakında eklenecek içerikleri takipte kalın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
