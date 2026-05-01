ALTER TABLE `twitter_accounts` ADD `trust_score` integer DEFAULT 3 NOT NULL;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `is_official` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `fetch_interval` integer DEFAULT 20 NOT NULL;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_fetched_at` text;
--> statement-breakpoint
ALTER TABLE `rss_sources` ADD `priority` integer DEFAULT 3 NOT NULL;
--> statement-breakpoint
ALTER TABLE `rss_sources` ADD `trust_score` integer DEFAULT 3 NOT NULL;
--> statement-breakpoint
ALTER TABLE `rss_sources` ADD `is_official` integer DEFAULT false NOT NULL;
