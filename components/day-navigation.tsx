"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DayNavigationProps {
  currentDate: string
  prevDate?: string
  nextDate?: string
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  })
}

export default function DayNavigation({ currentDate, prevDate, nextDate }: DayNavigationProps) {
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between border-b border-border/60 px-4 py-3">
      {prevDate ? (
        <Link
          href={`/${prevDate}`}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{formatShortDate(prevDate)}</span>
          <span className="sm:hidden">Önceki</span>
        </Link>
      ) : (
        <div />
      )}

      <span className="text-sm font-medium text-foreground">{formatShortDate(currentDate)}</span>

      {nextDate ? (
        <Link
          href={`/${nextDate}`}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <span className="hidden sm:inline">{formatShortDate(nextDate)}</span>
          <span className="sm:hidden">Sonraki</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
