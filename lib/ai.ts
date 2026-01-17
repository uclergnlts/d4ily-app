import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Lazy initialization to ensure env vars are loaded
let _genAI: GoogleGenerativeAI | null = null;

let _textModel: any = null;

function getGenAI() {
    if (!_genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined in environment variables. Please set it in .env.local");
        }
        _genAI = new GoogleGenerativeAI(apiKey);
    }
    return _genAI;
}

const digestSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        intro: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
        trends: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        watchlist: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        quote: { type: SchemaType.STRING, nullable: true }
    },
    required: ["title", "intro", "content", "trends", "watchlist"]
};

const weeklyDigestSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        intro: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
        highlights: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    category: { type: SchemaType.STRING },
                    items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                },
                required: ["category", "items"]
            }
        },
        trends: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
    },
    required: ["title", "intro", "content", "highlights", "trends"]
};

const articleSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },
        category: { type: SchemaType.STRING }
    },
    required: ["title", "summary", "category"]
};

const duplicateCheckSchema = {
    type: SchemaType.OBJECT,
    properties: {
        is_duplicate: { type: SchemaType.BOOLEAN },
        reason: { type: SchemaType.STRING }
    },
    required: ["is_duplicate", "reason"]
};

function getJsonModel(schema?: any) {
    return getGenAI().getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
            responseSchema: schema
        }
    });
}

function getTextModel() {
    if (!_textModel) {
        _textModel = getGenAI().getGenerativeModel({
            model: "gemini-2.0-flash",
        });
    }
    return _textModel;
}

export interface DigestData {
    title: string;
    intro: string;
    content: string; // Markdown/HTML content
    trends: string[];
    watchlist: string[];
    quote?: string;
}

// Helper function to format date with Turkish day names
function formatTurkishDate(dateString: string): string {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    // Check for special days
    const isLastWeekOfYear = date.getMonth() === 11 && dayNum >= 25;
    const isFirstWeekOfYear = date.getMonth() === 0 && dayNum <= 7;
    const isNewYearsEve = date.getMonth() === 11 && dayNum === 31;
    const isNewYear = date.getMonth() === 0 && dayNum === 1;

    if (isNewYearsEve) {
        return "Yılbaşı Gecesi";
    } else if (isNewYear) {
        return `${year} yılının ilk günü`;
    } else if (isLastWeekOfYear) {
        return `${year} yılının son ${dayName}'si`;
    } else if (isFirstWeekOfYear) {
        return `${year} yılının ilk ${dayName}'si`;
    }

    return `${dayNum} ${monthName} ${dayName}`;
}

// Helper to clean JSON string from Markdown fences or other artifacts
function cleanJsonString(text: string): string {
    // Remove markdown code blocks if present
    let clean = text.replace(/```json\s*/g, '').replace(/```\s*$/, '');
    // Remove any text before the first '{' and after the last '}'
    const startIndex = clean.indexOf('{');
    const endIndex = clean.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
        clean = clean.substring(startIndex, endIndex + 1);
    }
    return clean;
}

export async function generateDailyDigest(
    date: string,
    tweets: any[],
    news: any[],
    marketData?: any // Optional market data
): Promise<DigestData> {
    // API key is checked in getJsonModel()

    // Format date for greeting
    const formattedDate = formatTurkishDate(date);

    // Prepare context
    const tweetsText = tweets.map(t =>
        `- @${t.author_username}: ${t.raw_payload.text || t.raw_payload.full_text || "No text"} (Likes: ${t.like_count})`
    ).join("\n");

    const newsText = news.map(n =>
        `- **${n.title}** (${n.source_name} | ${n.category})
   Özet: ${n.summary?.substring(0, 250)}...
   ${n.image_url ? `Görsel: ${n.image_url}` : ''}`
    ).join("\n");

    const marketText = marketData ? `
    --- FINANCIAL DATA (For Context) ---
    USD/TRY: ${marketData.usd?.value} (${marketData.usd?.change}%)
    EUR/TRY: ${marketData.eur?.value} (${marketData.eur?.change}%)
    Gold (Gram): ${marketData.gold?.value} (${marketData.gold?.change}%)
    BIST 100: ${marketData.bist100?.value} (${marketData.bist100?.change}%)
    ` : "No financial data available.";

    const prompt = `
    You are the Chief Editor for "D4ily", Turkey's premium daily newsletter.
    
    DATE: ${formattedDate} (${date})
    
    TASK:
    Create a COMPREHENSIVE, DETAILED daily digest in TURKISH. This is a premium newsletter that readers expect to spend 5 MINUTES reading.
    Provide deep analysis, context, and multiple perspectives on each topic.
    
    INPUT DATA:
    
    ${marketText}

    --- TWEETS (Social Media Pulse & Reactions) ---
    ${tweetsText.substring(0, 30000)} 
    
    --- NEWS (AI-Processed Articles with Summaries & Images) ---
    ${newsText.substring(0, 25000)}
    
    *** CRITICAL REQUIREMENTS ***

    1. **CITATION RULE** - ALWAYS cite sources:
       - Use Markdown links: \`[Kaynak Adı](URL "Başlık")\`
       - For tweets: \`[@username](https://x.com/username/status/...)\`

    2. **LENGTH REQUIREMENT - THIS IS CRITICAL**:
       - The 'content' field MUST be 4000-6000 characters (approximately 600-900 words)
       - This is a PREMIUM newsletter - readers expect DETAILED coverage
       - Do NOT be brief - provide COMPREHENSIVE analysis
       - Each topic should have MULTIPLE paragraphs of context

    3. **TONE**:
       - Professional journalist, objective, analytical
       - Start with: "${formattedDate} sabahından herkese merhaba! Bugün Türkiye gündeminde öne çıkan gelişmeleri detaylı şekilde ele alıyoruz."

    **REQUIRED STRUCTURE FOR 'content' FIELD (Markdown):**

    [Opening Paragraph - 3-4 sentences]
    Summarize the overall mood and the TOP story of the day. Set the context.

    ---

    ## 📊 Piyasa Özeti
    - Write 2-3 sentences analyzing today's financial data (USD/TRY, EUR/TRY, Gold, BIST100)
    - Explain what the numbers mean for ordinary citizens
    - Mention any significant movements and potential causes

    ---

    ## 🔴 Günün Ana Başlıkları

    Select 7-10 MAJOR topics. For EACH topic:
    
    - **[Bold Topic Title]**: Write 2-3 sentences explaining the situation
      - First detail bullet with specific data or quotes
      - Second detail bullet with context or implications
      - Third detail bullet with expert reaction or what to watch
      - Fourth detail if there's more important info

    Example format:
    - **Emekli Maaşlarına Zam Açıklandı**: Hükümet, emekli maaşlarına yüzde 25 oranında zam yapılacağını açıkladı. Bu artış, yaklaşık 16 milyon emekliyi etkileyecek.
      - En düşük emekli maaşı 12.500 TL'den 15.625 TL'ye yükselecek
      - Zam oranı enflasyonun altında kaldı, muhalefet eleştirdi
      - Emekli sendikaları yetersiz buldu, ek düzenleme talep etti
      - Yeni maaşlar Şubat ayından itibaren ödenmeye başlanacak

    ---

    ## 📈 Dikkat Çekici Eğilimler
    Analyze 4-5 broader trends observed today:
    - For each trend, write 2-3 sentences of analysis
    - Connect different news items to show patterns
    - Explain why these trends matter

    ---

    ## 👀 Bugün ve Yarın İzlenmesi Gerekenler
    List 5-7 specific items to watch:
    - Include upcoming announcements, meetings, or data releases
    - Mention potential market-moving events
    - Note any developing stories

    ---

    [Closing Paragraph - 2-3 sentences]
    Wrap up with a forward-looking statement about what to expect.

    OUTPUT FORMAT (JSON):
    {
      "title": "A catchy, powerful headline summarizing the day (Max 70 chars)",
      "intro": "The warm opening + context paragraph (100-150 words)",
      "content": "The full markdown string with ALL sections above (4000-6000 chars minimum)",
      "trends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
      "watchlist": ["item1", "item2", "item3", "item4", "item5"]
    }
    `;

    try {
        // Use a model with higher output limit specifically for digest generation if needed,
        // but here we just ensure we use the configured json model
        const result = await getJsonModel(digestSchema).generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON safely
        try {
            const cleanText = cleanJsonString(text);
            const data = JSON.parse(cleanText) as DigestData;
            return data;
        } catch (parseError) {
            console.error("JSON PARSE ERROR. Raw Text from Gemini:", text);
            throw new Error(`Failed to parse Gemini JSON: ${parseError}`);
        }
    } catch (error) {
        console.error("Error generating digest with Gemini:", error);
        throw error;
    }
}

export interface WeeklyDigestData {
    title: string;
    intro: string;
    content: string; // Markdown content
    highlights: { category: string; items: string[] }[];
    trends: string[];
}

export async function generateWeeklyDigest(
    weekId: string,
    startDate: string,
    endDate: string,
    dailyDigests: any[]
): Promise<WeeklyDigestData> {
    // API key is checked in getJsonModel()

    // Prepare context from daily digests
    const digestsText = dailyDigests.map((d, idx) =>
        `### Day ${idx + 1}: ${d.digest_date} - ${d.title}\n${d.content}\n`
    ).join("\n\n");

    const prompt = `
    You are the Chief Editor for "D4ily", Turkey's premium newsletter. 
    
    TASK:
    Create a comprehensive WEEKLY DIGEST in TURKISH that summarizes the most important events from the past week.
    
    WEEK PERIOD: ${startDate} to ${endDate} (Week ${weekId})
    
    INPUT DATA (Daily Digests from this week):
    
    ${digestsText.substring(0, 35000)}
    
    REQUIREMENTS:
    
    1. **Title**: A powerful headline capturing the essence of the week (e.g., "Hafta Ekonomi ve Siyasetle Geçti")
    
    2. **Intro**: 3-4 sentences summarizing the week's mood and biggest story
    
    3. **Content** (Markdown, 2000-3500 characters):
       Structure with these H2 sections.
       IMPORTANT: Use DOUBLE NEWLINES (\n\n) between all sections, headers, and paragraphs for clear spacing.
       
       ## 📊 Haftanın Genel Görünümü
       - 1-2 paragraphs setting the context of the week
       
       ## 🔴 En Önemli Gelişmeler (By Category)
       ### Ekonomi
       - Top 2-3 economic events with details
       
       ### Siyaset
       - Top 2-3 political events with details
       
       ### Spor
       - Top 2-3 sports events with details
       
       ### Diğer
       - Any other major news (technology, health, international)
       
       ## 💡 Haftanın Çıkarımları
       - What does all this mean? 2-3 paragraphs of analysis
       
       ## 👀 Gelecek Hafta Nelere Dikkat?
       - 3-5 things to watch next week
    
    4. **Highlights**: Extract top 3-4 items per category
       Format: [{ category: "Ekonomi", items: ["...", "..."] }, ...]
    
    5. **Trends**: Top 7-10 keywords/topics from the week
    
    OUTPUT FORMAT (JSON):
    {
      "title": "...",
      "intro": "...",
      "content": "markdown string...",
      "highlights": [{ "category": "...", "items": ["..."] }],
      "trends": ["...", "..."]
    }
    `;

    try {
        const result = await getJsonModel(weeklyDigestSchema).generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const data = JSON.parse(text) as WeeklyDigestData;
        return data;
    } catch (error) {
        console.error("Error generating weekly digest with Gemini:", error);
        throw error;
    }
}

export async function generateWithGemini(prompt: string): Promise<string | null> {
    try {
        const result = await getTextModel().generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating generic content with Gemini:", error);
        return null; // Or throw depending on preference. Returning null is safer for non-critical features.
    }
}

export interface ProcessedArticleData {
    title: string;
    summary: string;
    category: string;
}

export async function summarizeArticle(
    title: string,
    rawContent: string,
    source: string
): Promise<ProcessedArticleData> {
    // API key is checked in getJsonModel()

    const prompt = `
    You are a professional editor for a news aggregator.
    
    TASK:
    Analyze the following news item and process it for our feed.
    
    INPUT:
    Source: ${source}
    Title: ${title}
    Content/Excerpt: ${rawContent.substring(0, 1500)}
    
    REQUIREMENTS:
    1. **Title**: 
       - rewritten in Turkish.
       - MUST be descriptive and factual (No "Clickbait", No "Şok", No "Son Dakika", No "...Belli Oldu", No "...Açıkladı" without saying WHAT).
       - If the original title is "Emekliye Müjde", rewrite it as "Emekli Maaşlarına %X Zam Yapıldı".
       - Max 80 chars.
    
    2. **Summary**: 
       - Concise 2-3 sentences in Turkish.
       - Focus on the "what" and "why".
       - No marketing language.
    
    3. **Category**: 
       - Choose ONE from: [Gündem, Ekonomi, Spor, Teknoloji, Dünya, Magazin, Sağlık, Makale, Analiz].
       - CRITICAL: If the content is a deep dive, opinion piece, or long-form analysis, label it as "Makale" or "Analiz".
       - If it's a short update, use other categories.
    
    4. **Quality Filter (Anti-Spam & Anti-Clickbait)**:
       - **ADVERTISEMENTS:** If the content is an ad, sponsored post, or purely marketing (e.g. promoting a specific product sale), return "SKIP" as the title.
       - **CLICKBAIT GARBAGE:** If the content provides NO real information and only teases (e.g. "Ünlü isimden şoke eden paylaşım!", "Bakın kim çıktı!", "Herkes bunu konuşuyor"), return "SKIP".
       - **IRRELEVANT:** If the content is about horoscope, betting odds, or very local/insignificant events, return "SKIP".
       
    5. **Tone Check**:
       - The title and summary must be journalistic and objective. No excitement exclamation marks (!).
    
    OUTPUT JSON:
    {
      "title": "...",
      "summary": "...",
      "category": "..."
    }
    `;

    try {
        const result = await getJsonModel(articleSchema).generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text) as ProcessedArticleData;
    } catch (error) {
        console.error("Error summarizing article with Gemini:", error);
        // Fallback or rethrow
        throw error;
    }
}

/**
 * Check if a new article is duplicate or very similar to existing articles
 * @param newTitle - Title of the new article to check
 * @param newSummary - Summary/content of the new article
 * @param existingArticles - Array of recent article titles to compare against
 * @returns Promise<boolean> - true if duplicate/very similar, false if unique
 */
export async function checkDuplicateArticle(
    newTitle: string,
    newSummary: string,
    existingArticles: string[]
): Promise<boolean> {
    // If no existing articles to compare, it's unique
    if (!existingArticles || existingArticles.length === 0) {
        return false;
    }

    const existingTitles = existingArticles.slice(0, 50); // Limit to last 50 for performance

    const prompt = `
    You are a news deduplication expert.
    
    TASK:
    Determine if the NEW article is a duplicate or very similar to any of the EXISTING articles.
    
    NEW ARTICLE:
    Title: ${newTitle}
    Summary: ${newSummary.substring(0, 300)}
    
    EXISTING ARTICLES (Recent):
    ${existingTitles.map((title, idx) => `${idx + 1}. ${title}`).join('\n')}
    
    CRITERIA FOR DUPLICATE:
    - Same event/news (e.g., both about "Erdoğan met with Biden")
    - Same person doing the same thing (e.g., both about "Mehmet Şimşek announced inflation data")
    - Same sports match result (e.g., both about "Galatasaray 2-1 Fenerbahçe")
    - Only minor wording differences
    
    NOT DUPLICATE if:
    - Different aspect of the same general topic (e.g., one about "inflation rising", another about "central bank's response to inflation")
    - Different people or events, even if in same category
    - Update/follow-up to a previous story with NEW information
    
    OUTPUT JSON:
    {
      "is_duplicate": true/false,
      "reason": "Brief explanation why it is or isn't a duplicate"
    }
    `;

    try {
        const result = await getJsonModel(duplicateCheckSchema).generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const data = JSON.parse(text) as { is_duplicate: boolean; reason: string };

        if (data.is_duplicate) {
            console.log(`  [DUPLICATE] ${data.reason}`);
        }

        return data.is_duplicate;
    } catch (error) {
        console.error("Error checking duplicate with AI:", error);
        // On error, assume not duplicate to avoid blocking legitimate news
        return false;
    }
}

