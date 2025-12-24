import { Clock, CheckCircle2 } from "lucide-react"

interface TimelineEvent {
  time: string
  title: string
  description: string
}

interface NewsTimelineProps {
  events: TimelineEvent[]
}

export function NewsTimeline({ events }: NewsTimelineProps) {
  if (!events || events.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-4">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary shadow-soft">
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
            </div>

            <div className="flex-1 rounded-lg border border-border bg-card p-4 shadow-soft transition-all hover:shadow-soft-lg">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <time>{event.time}</time>
              </div>
              <h4 className="mb-2 font-semibold text-foreground">{event.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export type { TimelineEvent }
