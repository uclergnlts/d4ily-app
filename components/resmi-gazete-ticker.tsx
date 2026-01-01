"use client"

import { FileText, ExternalLink } from "lucide-react"

interface ResmiGazeteTickerProps {
  summary: string | null
}

export function ResmiGazeteTicker({ summary }: ResmiGazeteTickerProps) {
  // Parse summary into list items if it's a markdown list, or just use it as single item
  // Assuming summary comes as a markdown string or similar. 
  // If it's a single string paragraph, we might want to split by sentences or just show it.
  // For ticker, bullet points work best.

  const defaultItems = [
    "Resmi Gazete verileri yükleniyor...",
    "Gündemden başlıklar ve önemli kararlar burada yer alacak.",
    "Günlük resmi gazete özetleri için takipte kalın."
  ]

  const items = summary
    ? summary.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^-\s*/, '').replace(/^\*\s*/, ''))
    : defaultItems

  // Filter out any empty items after cleanup
  const cleanItems = items.filter(item => item && item.length > 5)

  // Ensure we have something to show
  const displayItems = cleanItems.length > 0 ? cleanItems : defaultItems

  return (
    <div className="bg-red-50 border-b border-red-200 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div
          className="flex items-center gap-4 lg:gap-6 h-12"
          role="region"
          aria-label="Resmi Gazete Haberleri"
        >
          <div className="flex items-center gap-2 flex-shrink-0 z-10 bg-red-50 pr-4">
            <div className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center" aria-hidden="true">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-bold text-red-700 whitespace-nowrap tracking-wide hidden sm:inline">RESMİ GAZETE</span>
          </div>

          <div className="flex items-center gap-8 overflow-hidden w-full mask-linear-fade">
            <div className="flex items-center gap-8 animate-marquee lg:animate-none whitespace-nowrap min-w-full lg:min-w-0 lg:w-full lg:justify-start">
              {/* Original Content */}
              {displayItems.map((decision, index) => (
                <div key={`rg-${index}`} className="flex items-center gap-2 whitespace-nowrap">
                  <div className="w-1 h-1 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="text-xs text-gray-700">{decision}</span>
                </div>
              ))}

              {/* Duplicate for Mobile Loop */}
              {displayItems.map((decision, index) => (
                <div key={`rg-dup-${index}`} className="flex items-center gap-2 whitespace-nowrap lg:hidden">
                  <div className="w-1 h-1 rounded-full bg-red-400" aria-hidden="true" />
                  <span className="text-xs text-gray-700">{decision}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://www.resmigazete.gov.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors whitespace-nowrap flex-shrink-0 ml-auto z-10 bg-red-50 pl-4"
            aria-label="Tüm Resmi Gazete kararlarını görüntüle"
          >
            <span className="hidden sm:inline">Tümü</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
