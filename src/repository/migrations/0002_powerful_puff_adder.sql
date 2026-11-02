ALTER TABLE `events` ADD `connpass_event_id` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `events_connpass_event_id_unique` ON `events` (`connpass_event_id`);