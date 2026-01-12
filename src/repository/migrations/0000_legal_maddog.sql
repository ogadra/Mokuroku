CREATE TABLE `events` (
	`uid` text PRIMARY KEY NOT NULL,
	`dtstart` integer NOT NULL,
	`dtend` integer NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	`status` text NOT NULL,
	`class` text DEFAULT 'PUBLIC' NOT NULL,
	`created` integer DEFAULT (unixepoch()) NOT NULL,
	`last_modified` integer DEFAULT (unixepoch()) NOT NULL,
	`sequence` integer DEFAULT 0 NOT NULL
);
