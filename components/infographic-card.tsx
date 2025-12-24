import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatItem {
  label: string
  value: string | number
  change?: number
  suffix?: string
}

interface InfographicCardProps {
  title: string
  stats: StatItem[]
}

export default function InfographicCard({ title, stats }: InfographicCardProps) {
  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="h-4 w-4 text-muted-foreground" />
    if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getTrendColor = (change?: number) => {
    if (!change) return "text-muted-foreground"
    if (change > 0) return "text-emerald-600"
    return "text-red-600"
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-4 py-3">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col bg-card p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
              {stat.suffix && <span className="text-sm text-muted-foreground">{stat.suffix}</span>}
            </div>
            {stat.change !== undefined && (
              <div className={cn("mt-1 flex items-center gap-1 text-xs", getTrendColor(stat.change))}>
                {getTrendIcon(stat.change)}
                <span>
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
