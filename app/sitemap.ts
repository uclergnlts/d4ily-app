import type { MetadataRoute } from "next"
import { getArchiveDigests, getWeeklyDigestsArchive } from "@/lib/digest-data"
import { db } from "@/lib/db"
import { topics, blogPosts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://d4ily.com"

  // Get all archived digests for dynamic pages
  let digests: Awaited<ReturnType<typeof getArchiveDigests>> = []
  let weeklyDigests: Awaited<ReturnType<typeof getWeeklyDigestsArchive>> = []

  try {
    [digests, weeklyDigests] = await Promise.all([
      getArchiveDigests(),
      getWeeklyDigestsArchive(52) // Last year
    ])
  } catch (error) {
    digests = []
    weeklyDigests = []
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bugun`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/akis`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/haberler`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/arsiv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/haftalik-ozet`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/istatistikler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/gizlilik`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kullanim-kosullari`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // Blog Posts - Priority 0.7
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true));
    blogPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: "weekly",
      priority: 0.7
    }));
  } catch (e) {
    console.error("Sitemap: Failed to fetch blog posts", e);
  }

  // DB Topics - Priority 0.9
  let dbTopicPages: MetadataRoute.Sitemap = [];
  try {
    const allTopics = await db.select().from(topics);
    dbTopicPages = allTopics.map(topic => ({
      url: `${baseUrl}/konu/${topic.slug}`,
      lastModified: new Date(), // Topics are evergreen, maybe check last post date?
      changeFrequency: "daily",
      priority: 0.9
    }));
  } catch (e) {
    console.error("Sitemap: Failed to fetch topics", e);
  }

  // Daily digest pages - Priority 1.0 (Updated from 0.7)
  const digestPages: MetadataRoute.Sitemap = digests
    .filter((digest) => digest.digest_date)
    .map((digest) => {
      let lastModified: Date
      try {
        const dateStr = digest.updated_at || digest.created_at || digest.digest_date
        const parsedDate = new Date(dateStr)
        lastModified = isNaN(parsedDate.getTime()) ? new Date() : parsedDate
      } catch {
        lastModified = new Date()
      }

      return {
        url: `${baseUrl}/${digest.digest_date}`,
        lastModified,
        changeFrequency: "daily" as const, // Updated to daily as requested implicitly by high priority? Or keep weekly? User said priority 1.0.
        priority: 1.0, // Updated per user request
      }
    })

  // Weekly digest pages
  const weeklyPages: MetadataRoute.Sitemap = weeklyDigests.map((weekly) => ({
    url: `${baseUrl}/hafta/${weekly.week_id}`,
    lastModified: weekly.updated_at ? new Date(weekly.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Monthly archive pages
  const monthlyArchivePages: MetadataRoute.Sitemap = []
  const uniqueMonths = new Set<string>()

  digests.forEach((digest) => {
    if (digest.digest_date) {
      const [year, month] = digest.digest_date.split("-")
      uniqueMonths.add(`${year}/${month}`)
    }
  })

  uniqueMonths.forEach((yearMonth) => {
    monthlyArchivePages.push({
      url: `${baseUrl}/arsiv/${yearMonth}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  })

  // Categories (Static for now, could be dynamic)
  const categories = ["gundem", "siyaset", "ekonomi", "spor", "teknoloji", "saglik"]
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  // Trending topics (Legacy/Algorithmic) - Priority 0.6
  // Note: We overlap with DB topics potentially. Keeping for now but DB topics are primary.
  const trendingTopics = await import("@/lib/digest-data").then(mod => mod.getTrendingTopics(20)).catch(() => [])

  const trendingTopicPages: MetadataRoute.Sitemap = trendingTopics.map((topic) => ({
    url: `${baseUrl}/konu/${topic.word.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }))

  // AMP pages for digests
  const ampPages: MetadataRoute.Sitemap = digests
    .filter((digest) => digest.digest_date)
    .map((digest) => ({
      url: `${baseUrl}/amp/${digest.digest_date}`,
      lastModified: new Date(digest.updated_at || digest.created_at || digest.digest_date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  return [...staticPages, ...categoryPages, ...dbTopicPages, ...trendingTopicPages, ...digestPages, ...weeklyPages, ...blogPages, ...ampPages, ...monthlyArchivePages]
}

