import { TrendingUp, TrendingDown, Minus, Hash, Flame } from "lucide-react"
import type { TrendingTopic } from "@/lib/digest-data"

interface TrendingTopicsProps {
  topics: TrendingTopic[]
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  if (!topics || topics.length === 0) {
    return null
  }

  const getChangeIcon = (change: "up" | "down" | "stable") => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-3.5 w-3.5 text-green-500" />
      case "down":
        return <TrendingDown className="h-3.5 w-3.5 text-red-500" />
      default:
        return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
    }
  }

  const getBarWidth = (count: number, maxCount: number) => {
    return Math.max(20, (count / maxCount) * 100)
  }

  const maxCount = Math.max(...topics.map((t) => t.count))

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">Populer Konular</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">Son 7 gunde en cok gecen kelimeler</p>
          </div>
        </div>

        {/* Topic listesi */}
        <div className="p-4 sm:p-6">
          <div className="grid gap-3">
            {topics.slice(0, 10).map((topic, index) => (
              <div
                key={topic.word}
                className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                {/* Siralama */}
                <div
                  className={
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (index < 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")
                  }
                >
                  {index + 1}
                </div>

                {/* Kelime ve bar */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{topic.word}</span>
                    {getChangeIcon(topic.change)}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={
                        "h-full rounded-full transition-all " + (index < 3 ? "bg-primary" : "bg-muted-foreground/50")
                      }
                      style={{ width: getBarWidth(topic.count, maxCount) + "%" }}
                    />
                  </div>
                </div>

                {/* Sayi */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-sm font-semibold text-foreground">{topic.count}</span>
                  <span className="ml-1 text-xs text-muted-foreground">kez</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-secondary/20 px-4 py-3 text-center sm:px-6">
          <p className="text-xs text-muted-foreground">Gunluk ozetlerdeki kelime frekansi baz alinmistir</p>
        </div>
      </div>
    </section>
  )
}
