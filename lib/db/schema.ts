import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const dailyDigests = sqliteTable("daily_digests", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    digest_date: text("digest_date").notNull().unique(), // UNIQUE from SQL
    title: text("title"),
    intro: text("intro"),
    content: text("content").notNull(),
    trends: text("trends", { mode: "json" }),
    watchlist: text("watchlist", { mode: "json" }),
    tweets_count: integer("tweets_count"),
    news_count: integer("news_count"),
    model_name: text("model_name"),
    prompt_version: text("prompt_version"),
    status: text("status").default("generated").notNull(),
    error_message: text("error_message"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    published_at: text("published_at"),
    audio_url: text("audio_url"),
    audio_duration: integer("audio_duration_seconds"),
    audio_status: text("audio_status").default("pending"),
    audio_voice: text("audio_voice"),
    date: text("date").default(sql`CURRENT_DATE`).notNull(),
    category: text("category").default("gundem"), // economy, politics, sports, gundem
    word_count: integer("word_count").default(0).notNull(),
    published: integer("published", { mode: "boolean" }).default(false).notNull(),
    cover_image_url: text("cover_image_url"),
    greeting_text: text("greeting_text"),
    spotify_url: text("spotify_url"),
});

export const tweetsRaw = sqliteTable("tweets_raw", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tweet_id: text("tweet_id").notNull().unique(),
    source: text("source").default("apify/x").notNull(),
    published_at: text("published_at"),
    fetched_at: text("fetched_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    lang: text("lang"),
    author_username: text("author_username"),
    retweet_count: integer("retweet_count"),
    reply_count: integer("reply_count"),
    like_count: integer("like_count"),
    quote_count: integer("quote_count"),
    view_count: integer("view_count"),
    bookmark_count: integer("bookmark_count"),
    raw_payload: text("raw_payload", { mode: "json" }).notNull(),
});

export const newsRaw = sqliteTable("news_raw", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    source_id: text("source_id"),
    source_name: text("source_name"),
    title: text("title"),
    url: text("url").notNull().unique(),
    published_at: text("published_at"),
    fetched_at: text("fetched_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    lang: text("lang"),
    summary_raw: text("summary_raw"),
    raw_payload: text("raw_payload", { mode: "json" }).notNull(),
});

export const dailyEvents = sqliteTable("daily_events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull(),
    axis: text("axis").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    importance: integer("importance").notNull(),
    tweet_ids: text("tweet_ids").notNull(),
    news_ids: text("news_ids").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const audioAssets = sqliteTable("audio_assets", {
    // SQL: id uuid NOT NULL DEFAULT gen_random_uuid()
    // SQLite doesn't have gen_random_uuid(). We can use text and letting client generate or trigger.
    // Drizzle helper: `.$defaultFn(() => crypto.randomUUID())` is nice.
    // or just text.
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    type: text("type").notNull().unique(),
    file_url: text("file_url").notNull(),
    is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const digestReactions = sqliteTable("digest_reactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    digest_id: integer("digest_id").references(() => dailyDigests.id),
    visitor_id: text("visitor_id").notNull(),
    reaction: text("reaction"), // CHECK constraint in SQL, simple text here
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const subscribers = sqliteTable("subscribers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    source: text("source").default("website"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    unsubscribed_at: text("unsubscribed_at"),
});

export const weeklyDigests = sqliteTable("weekly_digests", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    week_id: text("week_id").notNull().unique(), // e.g., "2024-W52"
    year: integer("year").notNull(),
    week_number: integer("week_number").notNull(),
    start_date: text("start_date").notNull(), // Monday
    end_date: text("end_date").notNull(), // Sunday
    title: text("title").notNull(),
    intro: text("intro"),
    content: text("content").notNull(),
    highlights: text("highlights", { mode: "json" }), // Top highlights by category
    trends: text("trends", { mode: "json" }),
    digests_count: integer("digests_count").default(0),
    tweets_count: integer("tweets_count").default(0),
    news_count: integer("news_count").default(0),
    model_name: text("model_name"),
    status: text("status").default("generated").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    cover_image_url: text("cover_image_url"),
});

export const twitterAccounts = sqliteTable("twitter_accounts", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull().unique(),
    display_name: text("display_name"),
    category: text("category").default("genel"), // siyaset, ekonomi, spor, medya, etc.
    priority: integer("priority").default(0).notNull(), // 0-10, fetch priority
    is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    show_in_live_feed: integer("show_in_live_feed", { mode: "boolean" }).default(false).notNull(), // Show in /akis live feed
    notes: text("notes"),
    added_by: text("added_by").default("admin"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const rssSources = sqliteTable("rss_sources", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    url: text("url").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").default("gundem"),
    is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    fetch_interval: integer("fetch_interval").default(240), // Minutes (4 hours)
    last_fetched_at: text("last_fetched_at"),
    notes: text("notes"),
    added_by: text("added_by").default("admin"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const officialGazetteSummaries = sqliteTable("official_gazette_summaries", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull().unique(), // YYYY-MM-DD
    summary_markdown: text("summary_markdown").notNull(),
    gazette_url: text("gazette_url").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});
