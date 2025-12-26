import type { MetadataRoute } from "next"
import { getArchiveDigests } from "@/lib/digest-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://d4ily.com"

  // Get all archived digests for dynamic pages
  let digests: Awaited<ReturnType<typeof getArchiveDigests>> = []

  try {
    digests = await getArchiveDigests()
  } catch (error) {
    // If database fetch fails, return only static pages
    digests = []
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
      url: `${baseUrl}/arsiv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/istatistikler`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  const digestPages: MetadataRoute.Sitemap = digests
    .filter((digest) => digest.digest_date) // Only include digests with valid dates
    .map((digest) => {
      // Safely parse date, fallback to current date if invalid
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
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }
    })

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

  // Categories
  const categories = ["gundem", "siyaset", "ekonomi", "spor"]
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const trendingTopics = await import("@/lib/digest-data").then(mod => mod.getTrendingTopics(20)).catch(() => [])

  const topicPages: MetadataRoute.Sitemap = trendingTopics.map((topic) => ({
    url: `${baseUrl}/konu/${topic.word.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...topicPages, ...digestPages, ...monthlyArchivePages]
}
