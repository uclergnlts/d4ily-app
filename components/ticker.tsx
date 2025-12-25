"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Zap } from "lucide-react"

export function Ticker() {
    return (
        <div className="relative bg-black text-white text-[10px] md:text-xs font-bold py-2 overflow-hidden border-b border-white/10">
            <div className="absolute top-0 left-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 w-8 h-full" />
            <div className="absolute top-0 right-0 bg-gradient-to-l from-black via-transparent to-transparent z-10 w-8 h-full" />

            <div className="flex animate-marquee whitespace-nowrap items-center hover:pause">
                {/* We repeat the content to ensure seamless scrolling */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-4">
                        <span className="flex items-center gap-2 text-green-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            CANLI AKIŞ:
                        </span>
                        <Link href="/akis" className="hover:text-primary transition-colors hover:underline decoration-primary underline-offset-4">
                            Türkiye Gündemi Anlık Olarak Düşüyor
                        </Link>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-yellow-500 fill-current" />
                            Yapay Zeka Destekli Analiz
                        </span>
                        <span className="text-white/20">•</span>
                        <span>Haftalık Bülten Her Pazar 06:00'da</span>
                        <span className="text-white/20">•</span>
                        <span className="text-muted-foreground font-normal">Son Dakika Gelişmeleri İçin Bildirimleri Açın</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
