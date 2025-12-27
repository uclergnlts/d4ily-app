-- Create twitter_accounts table
CREATE TABLE IF NOT EXISTS `twitter_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`display_name` text,
	`category` text DEFAULT 'genel',
	`priority` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`show_in_live_feed` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`added_by` text DEFAULT 'admin',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `twitter_accounts_username_unique` ON `twitter_accounts` (`username`);

-- Create rss_sources table
CREATE TABLE IF NOT EXISTS `rss_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'gundem',
	`is_active` integer DEFAULT true NOT NULL,
	`fetch_interval` integer DEFAULT 240,
	`last_fetched_at` text,
	`notes` text,
	`added_by` text DEFAULT 'admin',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `rss_sources_url_unique` ON `rss_sources` (`url`);
