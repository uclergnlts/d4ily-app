import * as cheerio from 'cheerio'
import { unstable_cache } from "next/cache"

export interface MarketData {
    usd: MarketItem
    eur: MarketItem
    gold: MarketItem
    bist100: MarketItem
}

export interface MarketItem {
    value: string
    change: string
    direction: 'up' | 'down' | 'neutral'
}

async function fetchMarketDataUncached(): Promise<MarketData> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const response = await fetch('https://www.doviz.com/', {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to fetch market data')

        const html = await response.text()
        const $ = cheerio.load(html)

        const getData = (key: string): MarketItem => {
            const elements = $(`[data-socket-key="${key}"]`)

            let value = '0.00'
            let change = '0.00'
            let direction: 'up' | 'down' | 'neutral' = 'neutral'

            elements.each((_, el) => {
                const $el = $(el)
                const text = $el.text().trim()
                const classes = $el.attr('class') || ''

                if (classes.includes('value')) {
                    value = text
                }

                if (classes.includes('change-rate') || text.includes('%')) {
                    change = text.replace('%', '').trim()

                    if (classes.includes('up')) direction = 'up'
                    else if (classes.includes('down')) direction = 'down'
                }
            })

            return { value, change, direction }
        }

        return {
            usd: getData('USD'),
            eur: getData('EUR'),
            gold: getData('gram-altin'),
            bist100: getData('XU100')
        }

    } catch (error) {
        console.error("Market data fetch failed:", error)
        return {
            usd: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            eur: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            gold: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            bist100: { value: 'Unavailable', change: '0.00', direction: 'neutral' }
        }
    }
}

// ⚡ Cached version - revalidates every 5 minutes
export const getMarketData = unstable_cache(
    fetchMarketDataUncached,
    ['market-data'],
    { revalidate: 300 }
)
