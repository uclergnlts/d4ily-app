import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const jsonModel = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
        responseMimeType: "application/json",
    }
});

const textModel = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
});

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
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    // Prepare context
    const tweetsText = tweets.map(t =>
        `- @${t.author_username}: ${t.raw_payload.text || t.raw_payload.full_text || "No text"} (Likes: ${t.like_count})`
    ).join("\n");

    const newsText = news.map(n =>
        `- ${n.title} (${n.source_name}): ${n.summary_raw?.substring(0, 200)}...`
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
    Your goal is to inform the user completely about what happened yesterday and what to expect today.
    The tone should be professional, objective, insightful, and engaging. Avoid superficial summaries; provide context.
    
    INPUT DATA:
    
    ${marketText}

    --- TWEETS (Social Media Pulse & Reactions) ---
    ${tweetsText.substring(0, 25000)} 
    
    --- NEWS (Mainstream Headlines) ---
    ${newsText.substring(0, 15000)}
    
    REQUIREMENTS & STRUCTURE (Strictly Follow This):

    *** CRITICAL LENGTH CONSTRAINT ***
    The 'content' field MUST contain AT LEAST 1250 CHARACTERS.
    - If your draft is under 1250 characters, ADD MORE DETAIL, MORE ANALYSIS, MORE CONTEXT
    - Expand "Detaylı Gündem Analizi" with extensive analysis, quotes, and background information
    - Include specific examples, data points, and perspectives
    - Provide historical context and explain implications
    
    1. **Title**: A catchy, powerful headline summarizing the biggest story.
    2. **Intro**: 2-3 sentences setting the mood of the day.
    
    3. **Content (Markdown Body)**:
       MUST include the following sections with H2 (##) headers:
       
       ## 📋 Dünün Öne Çıkan Gelişmeleri
       - Provide a bulleted list of 5-7 distinct important events from yesterday.
       - Each bullet should be 1-2 sentences. 
       - Cover different topics (Politics, Economy, Sports, World).
       
       ## 🔍 Detaylı Gündem Analizi
       - This is the main body. Select the top 2-3 most discussed topics and analyze them in depth.
       - WRITE AT LEAST 3-4 PARAGRAPHS per topic. Do not be brief.
       - **Crucial**: Cite specific tweets or news sources provided in the input. Example: "X kullanıcısı @username'in belirttiği gibi..." or "NTV'nin haberine göre...".
       - Explain WHY this matters and what the background is.
       
       ## 📅 Bugün Takip Edilmesi Gereken Başlıklar
       - A section dedicated to what is expected to happen today or strictly followed.
       - List 3-5 items to watch out for (meetings, decisions, matches, etc.).
       
    4. **Trends**: Extract 5-7 viral hashtags/keywords.
    
    5. **Watchlist**: (For metadata) Return the same items from "Bugün Takip Edilmesi Gereken Başlıklar" as a generic array.
    
    OUTPUT FORMAT (JSON):
    {
      "title": "...",
      "intro": "...",
      "content": "markdown string...",
      "trends": ["...", "..."],
      "watchlist": ["...", "..."]
    }
  `;

    try {
        const result = await jsonModel.generateContent(prompt);
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
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

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
        const result = await jsonModel.generateContent(prompt);
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
    if (!apiKey) return null;
    try {
        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating generic content with Gemini:", error);
        return null; // Or throw depending on preference. Returning null is safer for non-critical features.
    }
}
