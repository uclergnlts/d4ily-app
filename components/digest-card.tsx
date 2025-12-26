import type React from "react"
import { type Digest, formatDateTR, countWords } from "@/lib/digest-data"
import SectionDivider from "@/components/section-divider"
import ShareButtons from "@/components/share-buttons"
import {
  Calendar,
  Clock,
  TrendingUp,
  Newspaper,
  AlertCircle,
  Lightbulb,
  Target,
  Megaphone,
  Building2,
  Users,
  Flame,
  ExternalLink,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface DigestCardProps {
  digest: Digest | null
  showHeader?: boolean
}

// Helper component for tooltips
function LinkTooltip({ text, url, title }: { text: string; url: string; title?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid hover:text-accent transition-colors cursor-pointer"
        >
          {text}
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[300px] p-0 overflow-hidden border-border/50 shadow-xl" sideOffset={5}>
        <div className="bg-popover p-3">
          {title && <div className="font-semibold text-sm mb-1 line-clamp-2 text-foreground">{title}</div>}
          <div className="flex items-center gap-2 text-xs text-muted-foreground break-all">
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function parseBoldOnly(text: string, baseKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let partKey = baseKey

  while (remaining.length > 0) {
    const startIdx = remaining.indexOf("**")
    if (startIdx === -1) {
      parts.push(remaining)
      break
    }

    if (startIdx > 0) {
      parts.push(remaining.substring(0, startIdx))
    }

    const afterStart = remaining.substring(startIdx + 2)
    const endIdx = afterStart.indexOf("**")

    if (endIdx === -1) {
      parts.push(remaining)
      break
    }

    const boldText = afterStart.substring(0, endIdx)
    parts.push(
      <strong key={`bold-${partKey++}`} className="font-semibold text-foreground">
        {boldText}
      </strong>,
    )
    remaining = afterStart.substring(endIdx + 2)
  }

  return parts.length > 0 ? parts : [text]
}

function parseRichText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    if (!linkMatch || linkMatch.index === undefined) {
      parts.push(...parseBoldOnly(remaining, key))
      break
    }

    if (linkMatch.index > 0) {
      const beforeLink = remaining.substring(0, linkMatch.index)
      parts.push(...parseBoldOnly(beforeLink, key))
    }

    const linkText = linkMatch[1]
    const urlPart = linkMatch[2]
    const titleMatch = urlPart.match(/^([^ ]+) "(.*)"$/)
    const url = titleMatch ? titleMatch[1] : urlPart.split(' ')[0]
    const title = titleMatch ? titleMatch[2] : (urlPart.includes('"') ? urlPart.split('"')[1] : undefined)

    parts.push(
      <LinkTooltip
        key={`link-${key++}`}
        text={linkText}
        url={url}
        title={title}
      />
    )

    remaining = remaining.substring(linkMatch.index + linkMatch[0].length)
  }

  return parts
}

function getCoverImage(title: string, content: string): string {
  return "/default-cover-gradient.jpg"
}

function parseContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let currentParagraph: string[] = []
  let key = 0
  let sectionCount = 0

  const getCategoryColor = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("ekonomi") || lowerTitle.includes("enflasyon") || lowerTitle.includes("faiz")) {
      return "text-blue-600 bg-blue-50 border-blue-200"
    }
    if (lowerTitle.includes("siyaset") || lowerTitle.includes("secim") || lowerTitle.includes("meclis")) {
      return "text-red-600 bg-red-50 border-red-200"
    }
    if (lowerTitle.includes("spor") || lowerTitle.includes("futbol") || lowerTitle.includes("mac")) {
      return "text-green-600 bg-green-50 border-green-200"
    }
    if (lowerTitle.includes("teknoloji") || lowerTitle.includes("yapay zeka") || lowerTitle.includes("dijital")) {
      return "text-purple-600 bg-purple-50 border-purple-200"
    }
    if (lowerTitle.includes("saglik") || lowerTitle.includes("hastane")) {
      return "text-pink-600 bg-pink-50 border-pink-200"
    }
    return "text-foreground bg-muted border-border"
  }

  const isTrending = (title: string) => {
    const trendingKeywords = ["imamoglu", "mehmet simsek", "suriye", "tbmm", "butce", "enflasyon", "secim", "dolar"]
    const lowerTitle = title.toLowerCase()
    return trendingKeywords.some((keyword) => lowerTitle.includes(keyword))
  }

  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("ozet") || lowerTitle.includes("gundemi")) {
      return <Newspaper className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("haber") || lowerTitle.includes("cikan")) {
      return <Megaphone className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("madde") || lowerTitle.includes("ana")) {
      return <Target className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("dikkat") || lowerTitle.includes("egilim")) {
      return <TrendingUp className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("yarin") || lowerTitle.includes("izlen")) {
      return <Lightbulb className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("ekonomi") || lowerTitle.includes("enflasyon")) {
      return <Building2 className="h-5 w-5 text-primary" />
    }
    if (lowerTitle.includes("secim") || lowerTitle.includes("siyasi")) {
      return <Users className="h-5 w-5 text-primary" />
    }
    return <AlertCircle className="h-5 w-5 text-primary" />
  }

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ")
      elements.push(
        <p key={key++} className="mb-6 text-base leading-loose text-foreground/90 sm:text-lg">
          {parseRichText(text)}
        </p>,
      )
      currentParagraph = []
    }
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine === "") {
      flushParagraph()
      continue
    }

    if (trimmedLine.startsWith("## Başlık:") || trimmedLine.startsWith("##Başlık:")) {
      flushParagraph()
      continue
    }

    if (trimmedLine.startsWith("## ")) {
      flushParagraph()
      if (sectionCount > 0) {
        const variants = ["dots", "line", "icon"] as const
        elements.push(<SectionDivider key={`divider-${key++}`} variant={variants[sectionCount % 3]} />)
      }
      sectionCount++
      const title = trimmedLine.substring(3)
      const categoryColor = getCategoryColor(title)
      const trending = isTrending(title)

      elements.push(
        <div key={key++} className="mb-8 mt-16 first:mt-0">
          <div className="flex items-center gap-3">
            <h2
              className={`inline-block rounded-lg border px-4 py-2 font-display text-2xl font-bold tracking-tight sm:text-3xl ${categoryColor}`}
            >
              {title}
            </h2>
            {trending && (
              <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-600">
                <Flame className="h-4 w-4" />
                Trend
              </span>
            )}
          </div>
        </div>,
      )
      continue
    }

    if (trimmedLine.startsWith("### ")) {
      flushParagraph()
      const title = trimmedLine.substring(4)
      elements.push(
        <div key={key++} className="mb-6 mt-12 flex items-center gap-2.5 first:mt-0">
          {getIconForTitle(title)}
          <h3 className="text-lg font-bold text-foreground sm:text-xl">{title}</h3>
        </div>,
      )
      continue
    }

    if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      flushParagraph()
      const content = trimmedLine.substring(2)
      elements.push(
        <ul key={key++} className="mb-4 list-disc pl-6 space-y-2">
          <li className="text-base leading-relaxed text-foreground/90 sm:text-lg pl-2 marker:text-primary">
            {parseRichText(content)}
          </li>
        </ul>,
      )
      continue
    }

    currentParagraph.push(trimmedLine)
  }

  flushParagraph()

  return elements
}

function getGradientForDate(date: string): string {
  const gradients = [
    "bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500", // Mavi-Turkuaz
    "bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500", // Mor-Pembe
    "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500", // Yeşil-Deniz
    "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500", // Turuncu-Kırmızı
    "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500", // Sarı-Turuncu
    "bg-gradient-to-br from-indigo-400 via-purple-500 to-blue-500", // İndigo-Mor
    "bg-gradient-to-br from-pink-400 via-rose-500 to-red-500", // Pembe-Kırmızı
  ]

  // Tarihi kullanarak tutarlı renk seçimi (aynı gün her zaman aynı renk)
  const dateNumber = new Date(date).getDate()
  const index = dateNumber % gradients.length
  return gradients[index]
}

export default function DigestCard({ digest, showHeader = true }: DigestCardProps) {
  if (!digest) {
    return null
  }

  const readingTime = Math.ceil(countWords(digest.content) / 200)

  const useCustomCover = digest.cover_image_url
  const gradientClass = getGradientForDate(digest.digest_date)

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:shadow-2xl">
      <div
        className={`relative aspect-[2/1] w-full overflow-hidden ${useCustomCover ? "bg-gradient-to-br from-primary/10 to-accent/10" : gradientClass}`}
      >
        {useCustomCover ? (
          <>
            <img
              src={digest.cover_image_url || "/placeholder.svg"}
              alt={`${digest.title || "Gündem"} kapak görseli`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <div className="text-center">
              <div className="mb-4 text-6xl font-bold text-white/90 drop-shadow-lg">
                {new Date(digest.digest_date).getDate()}
              </div>
              <div className="text-xl font-semibold text-white/80 drop-shadow-md">
                {formatDateTR(digest.digest_date)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 sm:p-10 lg:p-12">
        {showHeader && (
          <header className="mb-10 border-b border-border/40 pb-8">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={digest.digest_date}>{formatDateTR(digest.digest_date)}</time>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} dk okuma</span>
                </div>
              </div>
              <ShareButtons title={digest.title} date={digest.digest_date} />
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {digest.intro || "Türkiye'nin gündeminden en önemli gelişmeler, özenle derlenmiş özet formatında"}
            </p>
          </header>
        )}

        <div className="prose prose-stone mx-auto max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h3:mb-5 prose-h3:mt-12 prose-h3:flex prose-h3:items-center prose-h3:gap-3 prose-h3:text-xl prose-h3:first:mt-0 prose-p:mb-6 prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/85 prose-strong:font-semibold prose-strong:text-foreground sm:prose-h3:text-2xl sm:prose-p:text-lg">
          {parseContent(digest.content)}
        </div>

        <footer className="mt-14 border-t border-border/40 pt-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">
              {countWords(digest.content)} kelime • {readingTime} dakika okuma
            </span>
            <ShareButtons title={digest.title} date={digest.digest_date} />
          </div>
        </footer>
      </div>
    </article>
  )
}
