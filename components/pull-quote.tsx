import { Quote } from "lucide-react"

interface PullQuoteProps {
  quote: string
  author?: string
}

export default function PullQuote({ quote, author }: PullQuoteProps) {
  return (
    <blockquote className="relative my-10 border-l-4 border-primary/30 bg-secondary/30 py-6 pl-6 pr-4 sm:my-12 sm:pl-8 sm:pr-6">
      <Quote className="absolute -left-3 -top-3 h-8 w-8 rotate-180 text-primary/20" />
      <p className="font-display text-xl font-medium italic leading-relaxed text-foreground sm:text-2xl">&quot;{quote}&quot;</p>
      {author && <footer className="mt-4 text-sm font-medium text-muted-foreground">— {author}</footer>}
    </blockquote>
  )
}
