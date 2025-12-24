import { Sparkles } from "lucide-react"

interface SectionDividerProps {
  variant?: "dots" | "line" | "icon"
}

export function SectionDivider({ variant = "dots" }: SectionDividerProps) {
  if (variant === "line") {
    return (
      <div className="my-8 flex items-center justify-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    )
  }

  if (variant === "icon") {
    return (
      <div className="my-8 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <Sparkles className="h-4 w-4 text-primary/60" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>
    )
  }

  // Default: dots
  return (
    <div className="my-8 flex items-center justify-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
      <span className="h-2 w-2 rounded-full bg-primary/60" />
      <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
    </div>
  )
}

export default SectionDivider
