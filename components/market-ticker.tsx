"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import type { MarketData } from "@/lib/services/market"

interface MarketTickerProps {
  data: MarketData | null
}

export function MarketTicker({ data }: MarketTickerProps) {
  // If no data is passed (e.g. initial load or error), we can show loading or static fallback?
  // Let's use the passed data if available, otherwise maybe show dashes or skeleton.

  // Helper to parse change string to number for styling
  const getChangeInfo = (changeStr: string | undefined) => {
    if (!changeStr) return { value: "0.00", positive: true, number: 0 }
    // Clean string (replace % or arrows if any, though scraping usually returns plain number or with %)
    const cleanStr = changeStr.replace('%', '').trim()
    const num = parseFloat(cleanStr.replace(',', '.'))
    return {
      value: cleanStr,
      positive: num >= 0,
      number: num
    }
  }

  // Construct items for display
  const items = [
    { name: "DOLAR", ...getChangeInfo(data?.usd.change), price: data?.usd.value || "-" },
    { name: "EURO", ...getChangeInfo(data?.eur.change), price: data?.eur.value || "-" },
    { name: "GRAM ALTIN", ...getChangeInfo(data?.gold.change), price: data?.gold.value || "-" },
    { name: "BIST 100", ...getChangeInfo(data?.bist100.change), price: data?.bist100.value || "-" },
  ]

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-6 lg:gap-8 h-10">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap tracking-wide z-10 bg-white pr-2 hidden lg:block">PİYASALAR</span>
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap tracking-wide z-10 bg-white pr-2 lg:hidden absolute left-0 pl-4 h-full flex items-center shadow-[10px_0_10px_white]">PİYASALAR</span>

          <div className="flex items-center gap-8 overflow-hidden w-full mask-linear-fade">
            <div className="flex items-center gap-8 animate-marquee lg:animate-none whitespace-nowrap min-w-full lg:min-w-0 lg:w-full lg:justify-start pl-[80px] lg:pl-0">
              {/* Original Content */}
              {items.map((item) => (
                <div key={item.name} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-bold text-gray-700">{item.name}</span>
                  <span className="text-xs font-bold text-gray-900">{item.price}</span>
                  <span
                    className={`text-xs flex items-center gap-0.5 font-bold ${item.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.number > 0 ? "+" : ""}
                    {item.value}%
                  </span>
                </div>
              ))}

              {/* Duplicate for Mobile Loop */}
              {items.map((item) => (
                <div key={`${item.name}-duplicate`} className="flex items-center gap-2 whitespace-nowrap lg:hidden">
                  <span className="text-xs font-bold text-gray-700">{item.name}</span>
                  <span className="text-xs font-bold text-gray-900">{item.price}</span>
                  <span
                    className={`text-xs flex items-center gap-0.5 font-bold ${item.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {item.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.number > 0 ? "+" : ""}
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
