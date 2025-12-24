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

// Helper to extract ID from URL
function extractIdFromUrl(url?: string): string | undefined {
    if (!url) return undefined;
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : undefined;
}

export async function fetchUserTweets(username: string): Promise<TwitterApiTweet[]> {
    const apiKey = process.env.TWITTER_API_KEY;
    if (!apiKey) {
        throw new Error("TWITTER_API_KEY is not defined");
    }

    const url = "https://api.twitterapi.io/twitter/user/last_tweets";

    try {
        const response = await axios.get(url, {
            params: {
                userName: username,
                includeReplies: false,
                limit: 15, // Reduced to 15 per user request (fast fetch)
            },
            headers: {
                "X-API-Key": apiKey,
            },
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

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Map, normalize AND filter for 24h
        return rawTweets.map(t => {
            const id = t.id || t.tweetId || t.id_str || t.conversationId || t.rest_id || extractIdFromUrl(t.url) || extractIdFromUrl(t.twitterUrl);
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
                return new Date(t.createdAt) > oneDayAgo; // STRICT 24H FILTER
            });

    } catch (error: any) {
        console.error(`Error fetching tweets for ${username}:`, error.message);
        return [];
    }
}
