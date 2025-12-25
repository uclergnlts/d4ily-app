import * as cheerio from 'cheerio'

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

export async function getMarketData(): Promise<MarketData> {
    try {
        // We will mock this data first to ensure UI works, then implement actual scraping if needed.
        // Or implement a simple scrape from a reliable source like BigPara or Doviz.com
        // Let's scrape 'doviz.com' as it has a clean DOM.

        // Note: In production, you should cache this response heavily (e.g. 5-10 mins)
        // For now, we will assume standard fetch.

        const response = await fetch('https://www.doviz.com/', {
            next: { revalidate: 300 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        if (!response.ok) throw new Error('Failed to fetch market data')

        const html = await response.text()
        const $ = cheerio.load(html)

        // Selectors might change, this is best effort.
        // Only grabbing the main text for now.

        const getData = (key: string): MarketItem => {
            const elements = $(`[data-socket-key="${key}"]`)

            let value = '0.00'
            let change = '0.00'
            let direction: 'up' | 'down' | 'neutral' = 'neutral'

            elements.each((_, el) => {
                const $el = $(el)
                const text = $el.text().trim()
                const classes = $el.attr('class') || ''

                // Value usually has class 'value' or just is the one without '%'
                // We prioritize class check
                if (classes.includes('value')) {
                    value = text
                }

                // Change rate often contains % or has 'change' class
                if (classes.includes('change-rate') || text.includes('%')) {
                    change = text.replace('%', '').trim()

                    if (classes.includes('up')) direction = 'up'
                    else if (classes.includes('down')) direction = 'down'

                    // Sometimes direction is on parent or sibling, but usually on the change element itself in these frameworks
                }
            })

            // Fallback: If value found but change not found, try to find a sibling or analyze known structure
            // But checking all elements with key is usually decent coverage.

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
        // Fallback default data
        return {
            usd: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            eur: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            gold: { value: 'Unavailable', change: '0.00', direction: 'neutral' },
            bist100: { value: 'Unavailable', change: '0.00', direction: 'neutral' }
        }
    }
}
