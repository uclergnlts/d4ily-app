ALTER TABLE `twitter_accounts` ADD `last_fetch_started_at` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_fetch_completed_at` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_success_at` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_error_at` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_error_message` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_seen_tweet_id` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `last_seen_tweet_published_at` text;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `consecutive_error_count` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `total_fetch_count` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `total_error_count` integer DEFAULT 0 NOT NULL;
