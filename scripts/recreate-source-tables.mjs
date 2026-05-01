import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const suffix = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

const statements = [
  `ALTER TABLE twitter_accounts RENAME TO twitter_accounts_backup_${suffix}`,
  `ALTER TABLE rss_sources RENAME TO rss_sources_backup_${suffix}`,
  `CREATE TABLE IF NOT EXISTS twitter_accounts (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    username text NOT NULL,
    display_name text,
    category text DEFAULT 'genel',
    priority integer DEFAULT 3 NOT NULL,
    trust_score integer DEFAULT 3 NOT NULL,
    is_official integer DEFAULT false NOT NULL,
    fetch_interval integer DEFAULT 20 NOT NULL,
    last_fetched_at text,
    is_active integer DEFAULT true NOT NULL,
    show_in_live_feed integer DEFAULT false NOT NULL,
    notes text,
    added_by text DEFAULT 'admin',
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS twitter_accounts_username_unique_v2 ON twitter_accounts (username)`,
  `CREATE TABLE IF NOT EXISTS rss_sources (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    url text NOT NULL,
    name text NOT NULL,
    category text DEFAULT 'gundem',
    priority integer DEFAULT 3 NOT NULL,
    trust_score integer DEFAULT 3 NOT NULL,
    is_official integer DEFAULT false NOT NULL,
    is_active integer DEFAULT true NOT NULL,
    fetch_interval integer DEFAULT 240,
    last_fetched_at text,
    notes text,
    added_by text DEFAULT 'admin',
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS rss_sources_url_unique_v2 ON rss_sources (url)`,
];

for (const [index, sql] of statements.entries()) {
  try {
    await client.execute(sql);
    console.log("ok", index + 1);
  } catch (error) {
    const message = String(error?.message ?? error);
    if (
      message.includes("no such table") ||
      message.includes("already exists") ||
      message.includes("there is already another table or index with this name")
    ) {
      console.log("skip", index + 1, message);
      continue;
    }
    throw error;
  }
}

console.log(JSON.stringify({
  success: true,
  backupSuffix: suffix,
}, null, 2));
