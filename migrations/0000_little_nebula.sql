CREATE TABLE `audio_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`file_url` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audio_assets_type_unique` ON `audio_assets` (`type`);--> statement-breakpoint
CREATE TABLE `daily_digests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`digest_date` text NOT NULL,
	`title` text,
	`intro` text,
	`content` text NOT NULL,
	`trends` text,
	`watchlist` text,
	`tweets_count` integer,
	`news_count` integer,
	`model_name` text,
	`prompt_version` text,
	`status` text DEFAULT 'generated' NOT NULL,
	`error_message` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text,
	`audio_url` text,
	`audio_duration_seconds` integer,
	`audio_status` text DEFAULT 'pending',
	`audio_voice` text,
	`date` text DEFAULT CURRENT_DATE NOT NULL,
	`word_count` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`cover_image_url` text,
	`greeting_text` text,
	`spotify_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_digests_digest_date_unique` ON `daily_digests` (`digest_date`);--> statement-breakpoint
CREATE TABLE `daily_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`axis` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`importance` integer NOT NULL,
	`tweet_ids` text NOT NULL,
	`news_ids` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `digest_reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`digest_id` integer,
	`visitor_id` text NOT NULL,
	`reaction` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`digest_id`) REFERENCES `daily_digests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `news_raw` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` text,
	`source_name` text,
	`title` text,
	`url` text NOT NULL,
	`published_at` text,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`lang` text,
	`summary_raw` text,
	`raw_payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_raw_url_unique` ON `news_raw` (`url`);--> statement-breakpoint
CREATE TABLE `tweets_raw` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tweet_id` text NOT NULL,
	`source` text DEFAULT 'apify/x' NOT NULL,
	`published_at` text,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`lang` text,
	`author_username` text,
	`retweet_count` integer,
	`reply_count` integer,
	`like_count` integer,
	`quote_count` integer,
	`view_count` integer,
	`bookmark_count` integer,
	`raw_payload` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tweets_raw_tweet_id_unique` ON `tweets_raw` (`tweet_id`);