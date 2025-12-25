"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Minus, RefreshCcw } from "lucide-react"

interface MarketItem {
    value: string
    change: string
    direction: 'up' | 'down' | 'neutral'
}

interface MarketData {
    usd: MarketItem
    eur: MarketItem
    gold: MarketItem
    bist100: MarketItem
}

export function MarketWidget() {
    const [data, setData] = useState<MarketData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMarket() {
            try {
                const res = await fetch('/api/market')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchMarket()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-muted/40 rounded-xl" />
                ))}
            </div>
        )
    }

    if (!data) return null

    const Item = ({ label, item }: { label: string, item: MarketItem }) => {
        const isUp = item.direction === 'up'
        const isDown = item.direction === 'down'

        return (
            <div className="flex flex-col p-4 bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</span>
                <span className="text-lg font-bold font-mono tracking-tight text-foreground">{item.value}</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    %{item.change}
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
            <Item label="Dolar" item={data.usd} />
            <Item label="Euro" item={data.eur} />
            <Item label="Gram Altın" item={data.gold} />
            <Item label="BIST 100" item={data.bist100} />
        </div>
    )
}
