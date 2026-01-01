import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { NewsItem } from "@/lib/services/news"

interface NewsGridProps {
  news?: NewsItem[]
}

export function NewsGrid({ news = [] }: NewsGridProps) {
  // If empty, we might want to show nothing or a skeleton.
  // Using default empty array if undefined.

  const displayNews = news.length > 0 ? news : []

  // Helper to format time relative or absolute
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

      if (diffHours < 24) {
        return `${diffHours} saat önce`
      } else {
        return date.toLocaleDateString("tr-TR")
      }
    } catch {
      return ""
    }
  }

  // Helper to calculate mock read time or estimation
  const estimateReadTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0
    const minutes = Math.ceil(words / 200) || 5
    return `${minutes} dakika okuma`
  }

  if (displayNews.length === 0) return null

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">Son Haberler</h2>
          <Link
            href="/haberler"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            Hepsini Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {displayNews.map((item) => (
            <Link key={item.id} href={`/haber/${item.id}`} className="group cursor-pointer">
              <article>
                <div className="relative aspect-[4/3] mb-3.5 rounded-xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <img
                    src={item.image_url || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title)}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-xs font-semibold shadow-sm">
                      {item.source_name}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">{formatTime(item.processed_at)}</p>
                  <h3 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-xs text-red-600 font-semibold">{item.category}</span>
                    <span className="text-xs text-muted-foreground">{estimateReadTime(item.summary)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
