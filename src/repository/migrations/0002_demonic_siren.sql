PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`uid` text PRIMARY KEY NOT NULL,
	`dtstart` integer NOT NULL,
	`dtend` integer NOT NULL,
	`summary` text NOT NULL,
	`description` text,
	`url` text,
	`location` text NOT NULL,
	`status` text NOT NULL,
	`class` text DEFAULT 'PUBLIC' NOT NULL,
	`attendee_type` text NOT NULL,
	`created` integer DEFAULT (unixepoch()) NOT NULL,
	`last_modified` integer DEFAULT (unixepoch()) NOT NULL,
	`sequence` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_events`("uid", "dtstart", "dtend", "summary", "description", "url", "location", "status", "class", "attendee_type", "created", "last_modified", "sequence") SELECT "uid", "dtstart", "dtend", "summary", "description", "url", "location", "status", "class", "attendee_type", "created", "last_modified", "sequence" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;