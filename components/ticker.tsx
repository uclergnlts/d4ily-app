
"use client"

import Link from "next/link"
import { Zap, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { MarketData, MarketItem } from "@/lib/services/market"

interface TickerProps {
    data: MarketData
}

export function Ticker({ data }: TickerProps) {
    const renderItem = (label: string, item: MarketItem) => {
        const isUp = item.direction === 'up';
        const isDown = item.direction === 'down';

        return (
            <div className="flex items-center gap-1.5 px-3 border-r border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                <span className="text-white/70">{label}</span>
                <span className="font-mono text-white tracking-wide">{item.value}</span>
                <span className={`text-[10px] flex items-center gap-0.5 ${isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-400'}`}>
                    {isUp && <TrendingUp className="h-3 w-3" />}
                    {isDown && <TrendingDown className="h-3 w-3" />}
                    {item.direction === 'neutral' && <Minus className="h-3 w-3" />}
                    %{item.change}
                </span>
            </div>
        )
    }

    const renderContent = () => {
        if (!data) return <span className="text-white/50 px-4">Veriler yükleniyor...</span>;

        return (
            <>
                {renderItem("USD", data.usd)}
                {renderItem("EUR", data.eur)}
                {renderItem("ALTIN", data.gold)}
                {renderItem("BIST", data.bist100)}
            </>
        )
    };

    return (
        <div className="sticky top-0 z-[60] bg-black text-white text-[10px] md:text-xs font-bold py-2 overflow-hidden border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center gap-4">
                {/* Scrollable Area */}
                <div className="flex items-center gap-2 overflow-hidden flex-1 relative mask-linear-fade">
                    {/* Static Label */}
                    <span className="hidden sm:flex items-center gap-2 text-green-400 shrink-0 border-r border-white/20 pr-3 mr-1 z-10 bg-black">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>PİYASALAR:</span>
                    </span>

                    {/* Mobile Only: Live Icon without text */}
                    <span className="sm:hidden flex items-center gap-2 shrink-0 z-10 bg-black pr-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </span>

                    {/* Scrolling Content */}
                    <div className="flex items-center animate-marquee md:animate-none whitespace-nowrap gap-0 hover:pause">
                        <div className="flex items-center shrink-0">
                            {renderContent()}
                        </div>
                        {/* Duplicate for seamless infinite scroll on mobile */}
                        <div className="flex items-center shrink-0 md:hidden">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                {/* Right Side Info */}
                <div className="flex items-center gap-4 shrink-0 pl-1 border-l border-white/20 z-10 bg-black hidden xs:flex">
                    <span className="hidden md:flex items-center gap-2">
                        <Zap className="h-3 w-3 text-yellow-500 fill-current" />
                        Yapay Zeka Destekli Analiz
                    </span>
                    <span className="hidden md:inline text-white/20">•</span>
                    <span className="hidden md:inline">Haftalık Bülten Pazar 06:00&apos;da</span>
                </div>
            </div>
        </div>
    )
}
