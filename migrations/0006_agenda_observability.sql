CREATE TABLE `ingestion_runs` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `run_type` text NOT NULL,
  `status` text DEFAULT 'running' NOT NULL,
  `started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `completed_at` text,
  `duration_ms` integer,
  `processed_count` integer DEFAULT 0 NOT NULL,
  `fetched_count` integer DEFAULT 0 NOT NULL,
  `inserted_count` integer DEFAULT 0 NOT NULL,
  `error_count` integer DEFAULT 0 NOT NULL,
  `skipped_count` integer DEFAULT 0 NOT NULL,
  `freshness_window_hours` integer DEFAULT 24 NOT NULL,
  `stopped_early` integer DEFAULT false NOT NULL,
  `details` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ingestion_runs_run_type_idx` ON `ingestion_runs` (`run_type`);
--> statement-breakpoint
CREATE INDEX `ingestion_runs_started_at_idx` ON `ingestion_runs` (`started_at`);
--> statement-breakpoint
CREATE INDEX `ingestion_runs_status_idx` ON `ingestion_runs` (`status`);
--> statement-breakpoint
CREATE TABLE `agenda_snapshots` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `snapshot_key` text NOT NULL,
  `window_hours` integer DEFAULT 24 NOT NULL,
  `topic_count` integer DEFAULT 0 NOT NULL,
  `lead_count` integer DEFAULT 0 NOT NULL,
  `missed_alert_count` integer DEFAULT 0 NOT NULL,
  `source_coverage_score` integer,
  `payload` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agenda_snapshots_snapshot_key_unique` ON `agenda_snapshots` (`snapshot_key`);
--> statement-breakpoint
CREATE INDEX `agenda_snapshots_created_at_idx` ON `agenda_snapshots` (`created_at`);
--> statement-breakpoint
CREATE TABLE `quality_evaluations` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `evaluation_date` text NOT NULL,
  `expected_items` text NOT NULL,
  `matched_items` text NOT NULL,
  `missed_items` text NOT NULL,
  `extra_items` text,
  `recall_score` integer DEFAULT 0 NOT NULL,
  `precision_hint_score` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quality_evaluations_date_idx` ON `quality_evaluations` (`evaluation_date`);
--> statement-breakpoint
CREATE INDEX `quality_evaluations_created_at_idx` ON `quality_evaluations` (`created_at`);
