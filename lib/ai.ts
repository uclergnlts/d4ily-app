import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization to ensure env vars are loaded
let _genAI: GoogleGenerativeAI | null = null;
let _jsonModel: any = null;
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

function getJsonModel() {
    if (!_jsonModel) {
        _jsonModel = getGenAI().getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
    }
    return _jsonModel;
}

function getTextModel() {
    if (!_textModel) {
        _textModel = getGenAI().getGenerativeModel({
            model: "gemini-2.5-flash",
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

export async function generateDailyDigest(
    date: string,
    tweets: any[],
    news: any[],
    marketData?: any // Optional market data
): Promise<DigestData> {
    // API key is checked in getJsonModel()

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
    
    DATE: ${date}
    
    TASK:
    Analyze the provided Tweets, News, and Financial Data to create a comprehensive, long-form daily digest in TURKISH.
    Your goal is not just to summarize, but to provide a deep, narrative-driven analysis of the day's agenda.
    The output must be detailed, structured, and extensive (comparable to a professional diverse news briefing).
    
    INPUT DATA:
    
    ${marketText}

    --- TWEETS (Social Media Pulse & Reactions) ---
    ${tweetsText.substring(0, 30000)} 
    
    --- NEWS (AI-Processed Articles with Summaries & Images) ---
    ${newsText.substring(0, 25000)}
    
    NOTE: News items are pre-processed with:
    - AI-generated summaries in Turkish
    - Category classification (e.g., Gündem, Ekonomi, Politika, Spor)
    - Image URLs (where available)
    
    You can reference these images in your digest content if relevant, but this is optional.
    
    REQUIREMENTS & STRUCTURE (Strictly Follow This):

    *** CRITICAL CITATION RULE ***
    - **ALWAYS cite sources explicitly.**
    - Use Markdown links for citations using this exact format: \`[Kaynak Adı veya Metni](URL "Haber Başlığı")\`
    - Example: "...bu durum \`[NTV'nin haberine göre](https://ntv.com.tr/... "NTV: Enflasyon Rakamları Açıklandı")\` piyasaları etkiledi."
    - If citing a tweet: \`[@username](https://x.com/username/status/... "Tweet İçeriği")\` şeklinde belirt.

    *** CRITICAL LENGTH & DEPTH CONSTRAINT ***
    - The 'content' field MUST be concise but detailed (Target: 1500-2000 characters).
    - Do NOT be overly verbose. Focus on the most critical information.
    - If a topic is complex, break it down but keep it tight.
    - Use a professional, objective, yet engaging journalist tone.
    - **Start with a warm opening:** e.g., "${date} sabahından herkese merhaba, Türkiye gündemini birlikte gözden geçirelim."

    **STRUCTURE FOR 'content' FIELD (Markdown):**

    [Intro Paragraph]
    - Write a cohesive paragraph (2-3 sentences) summarizing the general mood of the country.

    ---

    ## Günün Ana Başlıkları (Maddeli Özet)
    - Select 5-7 MAJOR topics.
    - Format each topic as a main bullet with a **Bold Headline**, followed by a brief summary line.
    - Under each main bullet, add 2-3 sub-bullets (nested) with SPECIFIC details (data, quotes).
    - **Example Format:**
      - **Konu Başlığı**: Konunun özeti.
        - Detay 1: ... (Use citation links here!)
        - Detay 2: ...

    ---

    ## Dün Dikkat Çeken Eğilimler
    - Analyze 3-4 broader trends/patterns observed.
    - Keep this section sharp and insightful.

    ---

    ## Bugün İzlenmesi Gereken Başlıklar
    - List 3-5 specific items/events to watch today.

    **End with a short concluding sentence.**
    
    ---------------------------------------------------------
    
    4. **Trends (JSON Field)**: Extract 5-7 viral hashtags/keywords as an array of strings.
    
    5. **Watchlist (JSON Field)**: Return the titles of the items from "Bugün İzlenmesi Gereken Başlıklar" as a generic array.
    
    OUTPUT FORMAT (JSON):
    {
      "title": "A catchy, powerful headline (CRITICAL: Max 60 chars, curiosity-inducing but NOT clickbait. Use numbers, specific details, or questions when possible. Examples: 'Merkez Bankası Faizi Sabit Tuttu: Piyasalar Ne Diyor?', '3 Büyükler Arasında Puan Farkı Kapandı', 'Seçim Anketinde Sürpriz Sonuç Çıktı')",
      "intro": "The warm opening sentence + the context paragraph",
      "content": "The full markdown string starting from '---' divider downwards",
      "trends": ["...", "..."],
      "watchlist": ["...", "..."]
    }
    `;

    try {
        const result = await getJsonModel().generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON
        const data = JSON.parse(text) as DigestData;
        return data;
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
       Structure with these H2 sections:
       
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
        const result = await getJsonModel().generateContent(prompt);
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
    1. **Title**: Create a clickable, engaging, but NOT clickbait title in Turkish (Max 80 chars).
    2. **Summary**: Write a concise, 2-3 sentence summary in Turkish (Max 250 chars). Focus on the "what" and "why".
    3. **Category**: Choose the best category from: [Gündem, Ekonomi, Spor, Teknoloji, Dünya, Magazin, Sağlık].
    
    OUTPUT JSON:
    {
      "title": "...",
      "summary": "...",
      "category": "..."
    }
    `;

    try {
        const result = await getJsonModel().generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text) as ProcessedArticleData;
    } catch (error) {
        console.error("Error summarizing article with Gemini:", error);
        // Fallback or rethrow
        throw error;
    }
}
