import { db } from "@/lib/db";
import { twitterAccounts, rssSources } from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { TWITTER_USERS } from "@/lib/config/sources";

export type TwitterFetchSource = {
    username: string;
    priority: number;
    trustScore: number;
    isOfficial: boolean;
    fetchInterval: number;
    lastFetchedAt: string | null;
    lastSuccessAt: string | null;
    lastSeenTweetId: string | null;
    lastSeenTweetPublishedAt: string | null;
    consecutiveErrorCount: number;
};

export type RssFetchSource = {
    id: number;
    url: string;
    name: string;
    priority: number;
    trustScore: number;
    isOfficial: boolean;
    fetchInterval: number;
    lastFetchedAt: string | null;
};

/**
 * Get active Twitter accounts from database
 * Falls back to hardcoded list if database is empty
 */
export async function getActiveTwitterAccounts(): Promise<string[]> {
    try {
        const accounts = await db.select()
            .from(twitterAccounts)
            .where(eq(twitterAccounts.is_active, true));

        if (accounts.length > 0) {
            return accounts.map(a => a.username);
        }

        // Fallback to hardcoded if DB is empty
        console.warn("No active Twitter accounts found in database, using hardcoded list");
        return TWITTER_USERS;

    } catch (error) {
        console.error("Failed to fetch Twitter accounts from database:", error);
        return TWITTER_USERS; // Fallback
    }
}

export async function getTwitterAccountsDueForFetch(
    limit = 500,
    options: { force?: boolean; username?: string } = {},
): Promise<TwitterFetchSource[]> {
    try {
        const conditions = [eq(twitterAccounts.is_active, true)];
        if (options.username) {
            conditions.push(eq(twitterAccounts.username, options.username));
        }

        const accounts = await db
            .select({
                username: twitterAccounts.username,
                priority: twitterAccounts.priority,
                trustScore: twitterAccounts.trust_score,
                isOfficial: twitterAccounts.is_official,
                fetchInterval: twitterAccounts.fetch_interval,
                lastFetchedAt: twitterAccounts.last_fetched_at,
                lastSuccessAt: twitterAccounts.last_success_at,
                lastSeenTweetId: twitterAccounts.last_seen_tweet_id,
                lastSeenTweetPublishedAt: twitterAccounts.last_seen_tweet_published_at,
                consecutiveErrorCount: twitterAccounts.consecutive_error_count,
            })
            .from(twitterAccounts)
            .where(and(...conditions))
            .orderBy(desc(twitterAccounts.priority), desc(twitterAccounts.trust_score));

        if (accounts.length > 0) {
            const now = Date.now();
            const normalized = accounts.map((account) => {
                const fetchInterval = account.fetchInterval ?? 20;
                const lastFetchedAt = account.lastFetchedAt ?? null;
                const lastSuccessAt = account.lastSuccessAt ?? null;
                const lastFetchedMs = lastFetchedAt ? new Date(lastFetchedAt).getTime() : null;
                const lastSuccessMs = lastSuccessAt ? new Date(lastSuccessAt).getTime() : null;
                const minutesSinceFetch = lastFetchedMs && Number.isFinite(lastFetchedMs)
                    ? (now - lastFetchedMs) / 60000
                    : Number.POSITIVE_INFINITY;
                const minutesSinceSuccess = lastSuccessMs && Number.isFinite(lastSuccessMs)
                    ? (now - lastSuccessMs) / 60000
                    : Number.POSITIVE_INFINITY;
                const due = options.force || minutesSinceFetch >= fetchInterval;
                const notScannedWithin24h = minutesSinceSuccess >= 24 * 60;
                const overdueRatio = Number.isFinite(minutesSinceFetch)
                    ? minutesSinceFetch / Math.max(fetchInterval, 1)
                    : 999;

                return {
                    ...account,
                    fetchInterval,
                    lastFetchedAt,
                    lastSuccessAt,
                    due,
                    notScannedWithin24h,
                    overdueRatio,
                    minutesSinceFetch,
                    minutesSinceSuccess,
                };
            });

            const sortedDueAccounts = normalized
                .filter((account) => account.due)
                .sort((left, right) => {
                    const priorityDelta = right.priority - left.priority;
                    if (priorityDelta !== 0) return priorityDelta;

                    const overdueDelta = right.overdueRatio - left.overdueRatio;
                    if (Math.abs(overdueDelta) > 0.01) return overdueDelta;

                    const trustDelta = right.trustScore - left.trustScore;
                    if (trustDelta !== 0) return trustDelta;

                    const leftAge = Number.isFinite(left.minutesSinceFetch) ? left.minutesSinceFetch : Number.MAX_SAFE_INTEGER;
                    const rightAge = Number.isFinite(right.minutesSinceFetch) ? right.minutesSinceFetch : Number.MAX_SAFE_INTEGER;
                    return rightAge - leftAge;
                });

            if (options.force || options.username) {
                return sortedDueAccounts
                    .slice(0, limit)
                    .map(({ due, notScannedWithin24h, overdueRatio, minutesSinceFetch, minutesSinceSuccess, ...account }) => account);
            }

            const mustScanAccounts = sortedDueAccounts.filter((account) => account.notScannedWithin24h);
            if (mustScanAccounts.length >= limit) {
                return mustScanAccounts
                    .slice(0, limit)
                    .map(({ due, notScannedWithin24h, overdueRatio, minutesSinceFetch, minutesSinceSuccess, ...account }) => account);
            }

            const priorityWeights = new Map([
                [5, 0.25],
                [4, 0.30],
                [3, 0.30],
                [2, 0.15],
            ]);
            const selected = new Map<string, typeof sortedDueAccounts[number]>();

            for (const account of mustScanAccounts) {
                selected.set(account.username, account);
            }

            for (const [priority, weight] of priorityWeights) {
                const quota = Math.max(1, Math.floor(limit * weight));
                sortedDueAccounts
                    .filter((account) => account.priority === priority)
                    .slice(0, quota)
                    .forEach((account) => selected.set(account.username, account));
            }

            for (const account of sortedDueAccounts) {
                if (selected.size >= limit) break;
                selected.set(account.username, account);
            }

            return [...selected.values()]
                .slice(0, limit)
                .map(({ due, notScannedWithin24h, overdueRatio, minutesSinceFetch, minutesSinceSuccess, ...account }) => account);
        }

        const fallback = await getActiveTwitterAccounts();
        return fallback.slice(0, limit).map((username) => ({
            username,
            priority: 3,
            trustScore: 3,
            isOfficial: false,
            fetchInterval: 20,
            lastFetchedAt: null,
            lastSuccessAt: null,
            lastSeenTweetId: null,
            lastSeenTweetPublishedAt: null,
            consecutiveErrorCount: 0,
        }));
    } catch (error) {
        console.error("Failed to fetch due Twitter accounts:", error);
        return TWITTER_USERS.slice(0, limit).map((username) => ({
            username,
            priority: 3,
            trustScore: 3,
            isOfficial: false,
            fetchInterval: 20,
            lastFetchedAt: null,
            lastSuccessAt: null,
            lastSeenTweetId: null,
            lastSeenTweetPublishedAt: null,
            consecutiveErrorCount: 0,
        }));
    }
}

/**
 * Get Twitter accounts marked for live feed
 * Returns only personal accounts (not corporate/news)
 */
export async function getLiveFeedTwitterAccounts(): Promise<string[]> {
    try {
        const accounts = await db.select()
            .from(twitterAccounts)
            .where(and(
                eq(twitterAccounts.is_active, true),
                eq(twitterAccounts.show_in_live_feed, true)
            ));

        if (accounts.length > 0) {
            return accounts.map(a => a.username);
        }

        console.warn("No live feed accounts found in database");
        return [];

    } catch (error) {
        console.error("Failed to fetch live feed accounts:", error);
        return [];
    }
}

/**
 * Get active RSS sources from database.
 * RSS fallback is intentionally disabled while the product runs X-only.
 */
export async function getActiveRSSSources(): Promise<string[]> {
    try {
        const sources = await db.select()
            .from(rssSources)
            .where(eq(rssSources.is_active, true));

        if (sources.length > 0) {
            return sources.map(s => s.url);
        }

        return [];

    } catch (error) {
        console.error("Failed to fetch RSS sources from database:", error);
        return [];
    }
}

export async function getRSSSourcesDueForFetch(limit = 50): Promise<RssFetchSource[]> {
    try {
        const sources = await db
            .select({
                id: rssSources.id,
                url: rssSources.url,
                name: rssSources.name,
                priority: rssSources.priority,
                trustScore: rssSources.trust_score,
                isOfficial: rssSources.is_official,
                fetchInterval: rssSources.fetch_interval,
                lastFetchedAt: rssSources.last_fetched_at,
            })
            .from(rssSources)
            .where(and(
                eq(rssSources.is_active, true),
                sql`(${rssSources.last_fetched_at} IS NULL OR ${rssSources.last_fetched_at} <= datetime('now', '-' || ${rssSources.fetch_interval} || ' minutes'))`,
            ))
            .orderBy(desc(rssSources.priority), desc(rssSources.trust_score))
            .limit(limit);

        if (sources.length > 0) {
            return sources.map((source) => ({
                ...source,
                fetchInterval: source.fetchInterval ?? 240,
                lastFetchedAt: source.lastFetchedAt ?? null,
            }));
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch due RSS sources:", error);
        return [];
    }
}
