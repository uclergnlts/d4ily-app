import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import TrendingTopics from "@/components/trending-topics"
import { TrendingHashtags } from "@/components/trending-hashtags"
import { getTrendingTopics, getWeeklyStats, getArchiveDigests } from "@/lib/digest-data"
import { BarChart3, Calendar, Clock, FileText, MessageSquare, Newspaper, PieChart, TrendingUp, Zap } from "lucide-react"

export const revalidate = 3600

export default async function StatisticsPage() {
  const trendingTopics = await getTrendingTopics(7)
  const weeklyStats = await getWeeklyStats()
  const recentDigests = await getArchiveDigests()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1 px-4 py-8 sm:py-12">
        {/* Hero Header */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-3 text-4xl font-bold text-foreground sm:text-5xl font-serif">İstatistikler</h1>
            <p className="text-lg text-muted-foreground">Gündem analiziniz veri ile buluşuyor</p>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{weeklyStats.totalDigests}</p>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Haftalık Özet</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">{weeklyStats.totalTweets}</p>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Analiz Edilen Tweet</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">{weeklyStats.avgReadingTime} <span className="text-xl">dk</span></p>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Ort. Okuma Süresi</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">{recentDigests.length}</p>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Toplam Arşiv</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-12 mb-8">
            {/* Left Column - Kategori Dağılımı */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md h-full">
                <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-6 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 shadow-lg">
                    <PieChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Kategori Dağılımı</h2>
                    <p className="text-sm text-muted-foreground">Son 7 gündeki konu dağılımı</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-5">
                    {weeklyStats.topCategories.map((category, index) => {
                      const maxCount = weeklyStats.topCategories[0]?.count || 1
                      const percentage = Math.round((category.count / maxCount) * 100)
                      const colors = [
                        "bg-gradient-to-r from-blue-500 to-blue-600",
                        "bg-gradient-to-r from-green-500 to-green-600",
                        "bg-gradient-to-r from-orange-500 to-orange-600",
                        "bg-gradient-to-r from-purple-500 to-purple-600",
                        "bg-gradient-to-r from-pink-500 to-pink-600"
                      ]

                      return (
                        <div key={category.name} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                              <span className="text-sm font-semibold text-foreground">{category.name}</span>
                            </div>
                            <span className="text-sm font-bold text-foreground">{category.count}</span>
                          </div>
                          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className={"h-full rounded-full transition-all duration-500 group-hover:scale-105 " + colors[index % colors.length]}
                              style={{ width: percentage + "%" }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trending Hashtags */}
            <div className="lg:col-span-5">
              <TrendingHashtags />
            </div>
          </div>

          {/* Son Özetler Timeline */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Son Özetler</h2>
                <p className="text-sm text-muted-foreground">Günlük özet timeline</p>
              </div>
            </div>

            <div className="p-6">
              <div className="relative">
                {/* Timeline çizgisi */}
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                <div className="space-y-6">
                  {recentDigests.slice(0, 7).map((digest, index) => {
                    const date = new Date(digest.digest_date)
                    const dayName = date.toLocaleDateString("tr-TR", { weekday: "short" })
                    const dayNum = date.getDate()
                    const month = date.toLocaleDateString("tr-TR", { month: "short" })

                    return (
                      <div key={digest.id} className="relative flex gap-4 pl-12">
                        {/* Timeline noktası */}
                        <div
                          className={
                            "absolute left-3 top-2 h-5 w-5 rounded-full border-4 border-background transition-all " +
                            (index === 0
                              ? "bg-primary shadow-lg shadow-primary/50 animate-pulse"
                              : "bg-muted-foreground/30 hover:bg-muted-foreground/50")
                          }
                        />

                        <div className="group flex-1 rounded-xl border border-border bg-gradient-to-br from-secondary/20 to-secondary/5 p-5 transition-all hover:shadow-lg hover:border-primary/30">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-foreground">{dayName}</span>
                              <span className="text-sm text-muted-foreground">
                                {dayNum} {month}
                              </span>
                            </div>
                            {index === 0 && (
                              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                <TrendingUp className="h-3 w-3" />
                                Bugün
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                            {digest.title || "Türkiye Gündemi"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <TrendingTopics topics={trendingTopics} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
