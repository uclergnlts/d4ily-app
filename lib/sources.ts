import { db } from "@/lib/db";
import { twitterAccounts, rssSources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TWITTER_USERS, RSS_FEEDS } from "@/lib/config/sources";

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

/**
 * Get active RSS sources from database
 * Falls back to hardcoded list if database is empty
 */
export async function getActiveRSSSources(): Promise<string[]> {
    try {
        const sources = await db.select()
            .from(rssSources)
            .where(eq(rssSources.is_active, true));

        if (sources.length > 0) {
            return sources.map(s => s.url);
        }

        // Fallback to hardcoded if DB is empty
        console.warn("No active RSS sources found in database, using hardcoded list");
        return RSS_FEEDS;

    } catch (error) {
        console.error("Failed to fetch RSS sources from database:", error);
        return RSS_FEEDS; // Fallback
    }
}
