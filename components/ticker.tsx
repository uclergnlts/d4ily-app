"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Zap } from "lucide-react"

export function Ticker() {
    return (
        <div className="sticky top-0 z-[60] bg-black text-white text-[10px] md:text-xs font-bold py-2 overflow-hidden border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-4">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 text-green-400 shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        CANLI AKIŞ:
                    </span>
                    <Link href="/akis" className="hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4 truncate">
                        Türkiye Gündemi Anlık Olarak Düşüyor
                    </Link>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:flex items-center gap-2">
                        <Zap className="h-3 w-3 text-yellow-500 fill-current" />
                        Yapay Zeka Destekli Analiz
                    </span>
                    <span className="hidden md:inline text-white/20">•</span>
                    <span className="hidden md:inline">Haftalık Bülten Her Pazar 06:00'da</span>
                </div>
            </div>
        </div>
    )
}
