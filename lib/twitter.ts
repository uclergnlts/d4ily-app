import axios from "axios";

export interface TwitterApiTweet {
    id: string; // or tweetId? Assuming id based on standard.
    text?: string;
    fullText?: string;
    createdAt?: string;
    author?: {
        userName: string;
        name: string;
        id: string;
    };
    retweetCount?: number;
    replyCount?: number;
    likeCount?: number;
    quoteCount?: number;
    viewCount?: number;
    bookmarkCount?: number;
    lang?: string;
    url?: string;
    [key: string]: any;
}

export function getTwitterFetchLimit() {
    const fetchLimit = Number.parseInt(process.env.TWITTER_FETCH_LIMIT || "50", 10);
    return Number.isNaN(fetchLimit) ? 50 : Math.max(15, Math.min(fetchLimit, 100));
}

export function getTwitterFreshWindowHours() {
    const hours = Number.parseInt(process.env.TWITTER_FRESH_WINDOW_HOURS || "24", 10);
    return Number.isNaN(hours) ? 24 : Math.max(1, Math.min(hours, 48));
}

export function getTwitterApiTimeoutMs() {
    const timeoutMs = Number.parseInt(process.env.TWITTER_API_TIMEOUT_MS || "15000", 10);
    return Number.isNaN(timeoutMs) ? 15000 : Math.max(3000, timeoutMs);
}

// Helper to extract ID from URL
function extractIdFromUrl(url?: string): string | undefined {
    if (!url) return undefined;
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : undefined;
}

export function getTweetId(tweet: any): string | undefined {
    return tweet.id || tweet.tweetId || tweet.id_str || tweet.conversationId || tweet.rest_id || extractIdFromUrl(tweet.url) || extractIdFromUrl(tweet.twitterUrl);
}

export async function fetchUserTweets(username: string): Promise<TwitterApiTweet[]> {
    const apiKey = process.env.TWITTER_API_KEY;
    if (!apiKey) {
        throw new Error("TWITTER_API_KEY is not defined");
    }

    const url = "https://api.twitterapi.io/twitter/user/last_tweets";
    const fetchLimit = getTwitterFetchLimit();

    try {
        const response = await axios.get(url, {
            params: {
                userName: username,
                includeReplies: false,
                limit: fetchLimit,
            },
            headers: {
                "X-API-Key": apiKey,
            },
            timeout: getTwitterApiTimeoutMs(),
        });

        let rawTweets: any[] = [];

        // Inspect diverse response structures
        const data = response.data;
        if (data?.tweets) {
            rawTweets = data.tweets;
        } else if (data?.data?.tweets) {
            rawTweets = data.data.tweets;
        } else if (Array.isArray(data?.data)) {
            rawTweets = data.data;
        } else if (Array.isArray(data)) {
            rawTweets = data;
        } else if (data && typeof data === 'object' && !data.status) {
            // Fallback for single object that isn't a status wrapper
            rawTweets = [data];
        }

        const freshCutoff = new Date(Date.now() - getTwitterFreshWindowHours() * 60 * 60 * 1000);

        // Map, normalize AND filter for 24h
        return rawTweets.map(t => {
            const id = getTweetId(t);
            return {
                ...t,
                id: id,
                // ensure other fields exist
                createdAt: t.createdAt || t.created_at,
                retweetCount: t.retweetCount || t.retweet_count || 0,
                replyCount: t.replyCount || t.reply_count || 0,
                likeCount: t.likeCount || t.like_count || 0,
                viewCount: t.viewCount || t.view_count || 0,
                bookmarkCount: t.bookmarkCount || t.bookmark_count || 0,
                lang: t.lang || "en" // default
            };
        })
            .filter(t => t.id) // Filter out tweets without ID
            .filter(t => {
                if (!t.createdAt) return false;
                return new Date(t.createdAt) > freshCutoff; // STRICT FRESHNESS FILTER
            });

    } catch (error: any) {
        const status = error.response?.status ? ` (${error.response.status})` : "";
        const message = error.response?.data?.message || error.message;
        throw new Error(`Twitter fetch failed for ${username}${status}: ${message}`);
    }
}
