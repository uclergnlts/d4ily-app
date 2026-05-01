import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
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
  `ALTER TABLE twitter_accounts ADD username text`,
  `ALTER TABLE twitter_accounts ADD display_name text`,
  `ALTER TABLE twitter_accounts ADD category text DEFAULT 'genel'`,
  `ALTER TABLE twitter_accounts ADD priority integer DEFAULT 3 NOT NULL`,
  `ALTER TABLE twitter_accounts ADD trust_score integer DEFAULT 3 NOT NULL`,
  `ALTER TABLE twitter_accounts ADD is_official integer DEFAULT false NOT NULL`,
  `ALTER TABLE twitter_accounts ADD fetch_interval integer DEFAULT 20 NOT NULL`,
  `ALTER TABLE twitter_accounts ADD last_fetched_at text`,
  `ALTER TABLE twitter_accounts ADD is_active integer DEFAULT true NOT NULL`,
  `ALTER TABLE twitter_accounts ADD show_in_live_feed integer DEFAULT false NOT NULL`,
  `ALTER TABLE twitter_accounts ADD notes text`,
  `ALTER TABLE twitter_accounts ADD added_by text DEFAULT 'admin'`,
  `ALTER TABLE twitter_accounts ADD created_at text`,
  `ALTER TABLE twitter_accounts ADD updated_at text`,
  `CREATE UNIQUE INDEX IF NOT EXISTS twitter_accounts_username_unique ON twitter_accounts (username)`,

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
  `ALTER TABLE rss_sources ADD url text`,
  `ALTER TABLE rss_sources ADD name text`,
  `ALTER TABLE rss_sources ADD category text DEFAULT 'gundem'`,
  `ALTER TABLE rss_sources ADD priority integer DEFAULT 3 NOT NULL`,
  `ALTER TABLE rss_sources ADD trust_score integer DEFAULT 3 NOT NULL`,
  `ALTER TABLE rss_sources ADD is_official integer DEFAULT false NOT NULL`,
  `ALTER TABLE rss_sources ADD is_active integer DEFAULT true NOT NULL`,
  `ALTER TABLE rss_sources ADD fetch_interval integer DEFAULT 240`,
  `ALTER TABLE rss_sources ADD last_fetched_at text`,
  `ALTER TABLE rss_sources ADD notes text`,
  `ALTER TABLE rss_sources ADD added_by text DEFAULT 'admin'`,
  `ALTER TABLE rss_sources ADD created_at text`,
  `ALTER TABLE rss_sources ADD updated_at text`,
  `CREATE UNIQUE INDEX IF NOT EXISTS rss_sources_url_unique ON rss_sources (url)`,
];

for (const [index, sql] of statements.entries()) {
  try {
    await client.execute(sql);
    console.log("ok", index + 1);
  } catch (error) {
    const message = String(error?.message ?? error);
    if (
      message.includes("duplicate column name") ||
      message.includes("already exists") ||
      message.includes("Cannot add a column with non-constant default")
    ) {
      console.log("skip", index + 1, message);
      continue;
    }
    throw error;
  }
}
