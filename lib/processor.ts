
export interface ProcessedTweet {
    id: string;
    text: string;
    author: string;
    original: any;
    isSpam?: boolean;
    groupId?: string; // For deduplication
}

const SPAM_KEYWORDS = [
    "çekiliş", "airdrop", "crypto", "coin", "bitcoin", "ethereum",
    "bahis", "bonus", "kazanç", "dm for promo", "bet", "casino",
    "yasal bahis", "promosyon", "şans oyunları"
];

const BLOCKED_USERS: string[] = [
    // Add known spammer usernames here if needed
];

export class TweetProcessor {

    /**
     * Filters out spam tweets based on keywords and user blocklist
     */
    static filterSpam(tweets: any[]): any[] {
        console.log(`🛡️ Filtering spam from ${tweets.length} tweets...`);

        return tweets.filter(t => {
            const text = (t.text || t.full_text || t.raw_payload?.text || "").toLowerCase();
            const username = (t.author?.userName || t.author_username || "").toLowerCase();

            // Check blocked users
            if (BLOCKED_USERS.includes(username)) return false;

            // Check spam keywords
            if (SPAM_KEYWORDS.some(k => text.includes(k))) return false;

            // Check length (too short tweets are usually noise)
            if (text.length < 20 && !t.media) return false;

            return true;
        });
    }

    /**
     * Groups similar tweets to reduce noise/duplication
     * Uses simple Jaccard similarity
     */
    static deduplicate(tweets: any[]): any[] {
        console.log(`🧠 Deduplicating ${tweets.length} tweets...`);

        if (tweets.length === 0) return [];

        // Normalize structure
        const candidates = tweets.map(t => ({
            id: t.id,
            text: (t.text || t.full_text || t.raw_payload?.text || "").toLowerCase(),
            original: t
        }));

        const uniqueTweets: any[] = [];
        const seenTexts = new Set<string>();

        // Helper: Calculate Jaccard Similarity (Word intersection / union)
        const getSimilarity = (str1: string, str2: string) => {
            const set1 = new Set(str1.split(/\s+/));
            const set2 = new Set(str2.split(/\s+/));

            const intersection = new Set([...set1].filter(x => set2.has(x)));
            const union = new Set([...set1, ...set2]);

            return intersection.size / union.size;
        };

        for (const candidate of candidates) {
            // 1. Exact match check
            if (seenTexts.has(candidate.text)) continue;

            // 2. Similarity check against accepted unique tweets
            let isDuplicate = false;
            for (const existing of uniqueTweets) {
                const existingText = (existing.text || existing.full_text || existing.raw_payload?.text || "").toLowerCase();

                // If similarity > 0.6 (60% similar), consider it a duplicate/variant
                if (getSimilarity(candidate.text, existingText) > 0.6) {
                    isDuplicate = true;
                    // Optionally: Keep the one with more engagement? 
                    // For now, first-come first-served (usually newest first if sorted)
                    break;
                }
            }

            if (!isDuplicate) {
                uniqueTweets.push(candidate.original);
                seenTexts.add(candidate.text);
            }
        }

        console.log(`✅ Reduced to ${uniqueTweets.length} unique tweets (Removed ${tweets.length - uniqueTweets.length})`);
        return uniqueTweets;
    }

    /**
     * Main processing pipeline
     */
    static process(tweets: any[]): any[] {
        let processed = this.filterSpam(tweets);
        processed = this.deduplicate(processed);
        return processed;
    }
}
