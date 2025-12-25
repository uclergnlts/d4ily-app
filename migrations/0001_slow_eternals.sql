CREATE TABLE `rss_sources` (
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
--> statement-breakpoint
CREATE UNIQUE INDEX `rss_sources_url_unique` ON `rss_sources` (`url`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`source` text DEFAULT 'website',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`unsubscribed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `twitter_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`display_name` text,
	`category` text DEFAULT 'genel',
	`priority` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`notes` text,
	`added_by` text DEFAULT 'admin',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `twitter_accounts_username_unique` ON `twitter_accounts` (`username`);--> statement-breakpoint
CREATE TABLE `weekly_digests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week_id` text NOT NULL,
	`year` integer NOT NULL,
	`week_number` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`title` text NOT NULL,
	`intro` text,
	`content` text NOT NULL,
	`highlights` text,
	`trends` text,
	`digests_count` integer DEFAULT 0,
	`tweets_count` integer DEFAULT 0,
	`news_count` integer DEFAULT 0,
	`model_name` text,
	`status` text DEFAULT 'generated' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`cover_image_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weekly_digests_week_id_unique` ON `weekly_digests` (`week_id`);--> statement-breakpoint
ALTER TABLE `daily_digests` ADD `category` text DEFAULT 'gundem';