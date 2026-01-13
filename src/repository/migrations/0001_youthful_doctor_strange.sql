DROP TABLE IF EXISTS temp;
--> statement-breakpoint
CREATE TABLE `temp` (
	`uid` text PRIMARY KEY NOT NULL,
	`dtstart` integer NOT NULL,
	`dtend` integer NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	`status` text NOT NULL,
	`class` text DEFAULT 'PUBLIC' NOT NULL,
	`attendee_type` text NOT NULL,
	`created` integer DEFAULT (unixepoch()) NOT NULL,
	`last_modified` integer DEFAULT (unixepoch()) NOT NULL,
	`sequence` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO temp
(
	`uid`,
	`dtstart`,
	`dtend`,
	`summary`,
	`description`,
	`location`,
	`status`,
	`class`,
	`attendee_type`,
	`created`,
	`last_modified`,
	`sequence`
)
SELECT
	`uid`,
	`dtstart`,
	`dtend`,
	`summary`,
	`description`,
	`location`,
	`status`,
	`class`,
	'ATTENDEE',
	`created`,
	`last_modified`,
	`sequence`
FROM events;
--> statement-breakpoint
DROP TABLE events;
--> statement-breakpoint
CREATE TABLE `events` (
	`uid` text PRIMARY KEY NOT NULL,
	`dtstart` integer NOT NULL,
	`dtend` integer NOT NULL,
	`summary` text NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	`status` text NOT NULL,
	`class` text DEFAULT 'PUBLIC' NOT NULL,
	`attendee_type` text NOT NULL,
	`created` integer DEFAULT (unixepoch()) NOT NULL,
	`last_modified` integer DEFAULT (unixepoch()) NOT NULL,
	`sequence` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO events
(
	`uid`,
	`dtstart`,
	`dtend`,
	`summary`,
	`description`,
	`location`,
	`status`,
	`class`,
	`attendee_type`,
	`created`,
	`last_modified`,
	`sequence`
)
SELECT
	`uid`,
	`dtstart`,
	`dtend`,
	`summary`,
	`description`,
	`location`,
	`status`,
	`class`,
	`attendee_type`,
	`created`,
	`last_modified`,
	`sequence`
FROM temp;
--> statement-breakpoint
DROP TABLE temp;
