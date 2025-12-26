import { ScrollText, ExternalLink } from "lucide-react"

interface OfficialGazetteCardProps {
    summary: {
        date: string
        summary_markdown: string
        gazette_url: string
    } | null
}

export function OfficialGazetteCard({ summary }: OfficialGazetteCardProps) {
    if (!summary) return null

    // Simple markdown parser to list items (stripping markdown syntax for clean display)
    const items = summary.summary_markdown
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*\*\*(.*?)\*\*:\s*/, '$1: ')) // Convert "**Title**: Desc" to "Title: Desc" but keep visuals clean

    return (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/50 p-6 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                        <ScrollText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold font-serif text-lg text-red-950 dark:text-red-100">Resmi Gazete</h3>
                        <p className="text-xs text-red-600/80 dark:text-red-400 font-medium uppercase tracking-wide">BUGÜNÜN KARARLARI</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {items.length > 0 ? (
                    items.map((item, idx) => {
                        const [title, desc] = item.split(': ')
                        return (
                            <div key={idx} className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <p className="text-sm text-foreground/90 leading-snug">
                                    <span className="font-semibold text-red-900 dark:text-red-200">{title}</span>{desc ? `: ${desc}` : ''}
                                </p>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-sm text-muted-foreground italic">Bugün için öne çıkan kritik bir karar bulunamadı veya henüz analiz edilmedi.</p>
                )}
            </div>

            <a
                href={summary.gazette_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400 hover:underline gap-1 transition-transform active:scale-95"
            >
                Resmi Gazete'yi İncele
                <ExternalLink className="w-3 h-3" />
            </a>
        </div>
    )
}
