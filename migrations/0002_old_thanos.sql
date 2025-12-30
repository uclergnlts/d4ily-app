CREATE TABLE `blog_generation_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`run_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`selected_topic` text NOT NULL,
	`cluster` text,
	`evergreen_score` integer,
	`result` text NOT NULL,
	`reason` text,
	`generated_post_id` integer
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image_url` text,
	`published` integer DEFAULT false NOT NULL,
	`seo_score` integer DEFAULT 0,
	`view_count` integer DEFAULT 0,
	`topic_id` integer,
	`tags` text,
	`meta_title` text,
	`meta_description` text,
	`published_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `internal_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_post_id` integer,
	`target_post_id` integer,
	`anchor_text` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`term` text NOT NULL,
	`volume` integer DEFAULT 0,
	`difficulty` integer DEFAULT 0,
	`target_post_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`target_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `keywords_term_unique` ON `keywords` (`term`);--> statement-breakpoint
CREATE TABLE `official_gazette_summaries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`summary_markdown` text NOT NULL,
	`gazette_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `official_gazette_summaries_date_unique` ON `official_gazette_summaries` (`date`);--> statement-breakpoint
CREATE TABLE `processed_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original_news_id` integer,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`category` text DEFAULT 'Gündem',
	`image_url` text,
	`source_name` text,
	`published_at` text,
	`processed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`original_news_id`) REFERENCES `news_raw`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `processed_articles_processed_at_idx` ON `processed_articles` (`processed_at`);--> statement-breakpoint
CREATE INDEX `processed_articles_original_id_idx` ON `processed_articles` (`original_news_id`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`parent_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_name_unique` ON `topics` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `topics_slug_unique` ON `topics` (`slug`);--> statement-breakpoint
ALTER TABLE `twitter_accounts` ADD `show_in_live_feed` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `news_fetched_idx` ON `news_raw` (`fetched_at`);--> statement-breakpoint
CREATE INDEX `tweets_fetched_idx` ON `tweets_raw` (`fetched_at`);--> statement-breakpoint
CREATE INDEX `tweets_published_idx` ON `tweets_raw` (`published_at`);