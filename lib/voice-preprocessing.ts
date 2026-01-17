import OpenAI from 'openai';

// Lazy initialization for OpenAI client
let _openai: OpenAI | null = null;

function getOpenAI() {
    if (!_openai) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not defined in environment variables");
        }
        _openai = new OpenAI({ apiKey });
    }
    return _openai;
}

/**
 * Turkish pronunciation corrections - converts symbols and abbreviations to spoken form
 */
const TURKISH_PRONUNCIATION_RULES: [RegExp, string][] = [
    // Percentage
    [/%(\d+)/g, 'yüzde $1'],
    [/(\d+)%/g, 'yüzde $1'],

    // Currency
    [/(\d+(?:[.,]\d+)?)\s*TL/gi, '$1 Türk Lirası'],
    [/(\d+(?:[.,]\d+)?)\s*USD/gi, '$1 Amerikan doları'],
    [/(\d+(?:[.,]\d+)?)\s*EUR/gi, '$1 Euro'],
    [/(\d+(?:[.,]\d+)?)\s*\$/g, '$1 dolar'],
    [/(\d+(?:[.,]\d+)?)\s*€/g, '$1 Euro'],

    // Common Turkish abbreviations
    [/\bTCMB\b/g, 'Türkiye Cumhuriyet Merkez Bankası'],
    [/\bTÜİK\b/g, 'Türkiye İstatistik Kurumu'],
    [/\bTBMM\b/g, 'Türkiye Büyük Millet Meclisi'],
    [/\bABD\b/g, 'Amerika Birleşik Devletleri'],
    [/\bAB\b/g, 'Avrupa Birliği'],
    [/\bBIST\b/g, 'Borsa İstanbul'],
    [/\bKKM\b/g, 'kur korumalı mevduat'],
    [/\bFED\b/gi, 'Fed'],
    [/\bECB\b/gi, 'Avrupa Merkez Bankası'],
    [/\bIMF\b/gi, 'Uluslararası Para Fonu'],
    [/\bNATO\b/gi, 'NATO'],
    [/\bBM\b/g, 'Birleşmiş Milletler'],
    [/\bKDV\b/g, 'katma değer vergisi'],
    [/\bÖTV\b/g, 'özel tüketim vergisi'],
    [/\bSGK\b/g, 'Sosyal Güvenlik Kurumu'],

    // Time expressions  
    [/(\d{1,2}):(\d{2})/g, '$1 saat $2'],

    // Decimal numbers - read naturally
    [/(\d+),(\d+)/g, '$1 virgül $2'],
    [/(\d+)\.(\d{3})/g, '$1$2'], // Remove thousands separator dots

    // Clean up multiple spaces
    [/\s+/g, ' '],
];

/**
 * Apply Turkish pronunciation rules to text
 */
export function applyTurkishPronunciation(text: string): string {
    let result = text;
    for (const [pattern, replacement] of TURKISH_PRONUNCIATION_RULES) {
        result = result.replace(pattern, replacement);
    }
    return result.trim();
}

/**
 * Voice preprocessing prompt for GPT
 */
const VOICE_PREPROCESSING_PROMPT = `Sen profesyonel bir Türk radyo spikeri ve podcast sunucususun. Sana verilen metni TTS (text-to-speech) sistemi için optimize et.

KURALLAR:
1. Metni doğal, akıcı bir şekilde okunabilir hale getir
2. Uzun cümleleri doğal duraklama noktalarında böl (virgül veya nokta ekle)
3. Önemli bilgilerde hafif vurgu için "..." kullan
4. Sayıları ve istatistikleri anlaşılır şekilde oku
5. Paragraflar arasında doğal geçişler sağla
6. Resmi ama samimi bir ton kullan - podcast havası ver
7. Gereksiz tekrarları kaldır
8. Kısa, net cümleler kur
9. "Bugün sizlerle" gibi sunucu ifadeleri EKLEME - sadece içeriği optimize et
10. Orijinal içeriği DEĞIŞTIRME - sadece okunabilirlik için düzenle

ÖRNEK DÖNÜŞÜM:
Girdi: "Enflasyon %45.2'ye ulaştı TCMB faiz kararını açıkladı"
Çıktı: "Enflasyon yüzde 45 virgül 2'ye ulaştı... Türkiye Cumhuriyet Merkez Bankası faiz kararını açıkladı."

Şimdi aşağıdaki metni optimize et. SADECE optimize edilmiş metni döndür, başka açıklama ekleme:`;

/**
 * Preprocess text for natural voice synthesis using GPT
 */
export async function preprocessForVoice(text: string): Promise<string> {
    // First apply rule-based Turkish pronunciation
    let processedText = applyTurkishPronunciation(text);

    // If text is very short, skip GPT processing
    if (processedText.length < 100) {
        return processedText;
    }

    try {
        const openai = getOpenAI();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: VOICE_PREPROCESSING_PROMPT
                },
                {
                    role: 'user',
                    content: processedText
                }
            ],
            temperature: 0.3, // Low temperature for consistent output
            max_tokens: Math.min(processedText.length * 2, 4000),
        });

        const optimizedText = response.choices[0]?.message?.content?.trim();

        if (optimizedText && optimizedText.length > 0) {
            console.log(`Voice preprocessing: ${processedText.length} -> ${optimizedText.length} chars`);
            return optimizedText;
        }

        // Fallback to rule-based processing if GPT fails
        return processedText;

    } catch (error) {
        console.error('Voice preprocessing failed, using rule-based fallback:', error);
        return processedText;
    }
}

/**
 * Quick preprocessing without GPT (for testing or fallback)
 */
export function preprocessForVoiceSync(text: string): string {
    return applyTurkishPronunciation(text);
}
