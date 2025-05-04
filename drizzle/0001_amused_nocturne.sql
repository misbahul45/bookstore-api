CREATE TABLE `book_images` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`book_id` varchar(36) NOT NULL,
	`image_url` varchar(255) NOT NULL,
	`image_id` varchar(255) NOT NULL,
	`caption` varchar(255),
	`is_featured` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `book_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `books_table` ADD `cover_id` varchar(255);--> statement-breakpoint
ALTER TABLE `books_table` ADD `file_id` varchar(255);--> statement-breakpoint
ALTER TABLE `chat_messages_table` ADD `attachment_id` varchar(255);--> statement-breakpoint
ALTER TABLE `order_items_table` ADD `download_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users_table` ADD `avatar_id` varchar(255);--> statement-breakpoint
ALTER TABLE `book_images` ADD CONSTRAINT `book_images_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `book_id_idx` ON `book_images` (`book_id`);--> statement-breakpoint
CREATE INDEX `sort_order_idx` ON `book_images` (`sort_order`);