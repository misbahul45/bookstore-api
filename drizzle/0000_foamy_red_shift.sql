CREATE TABLE `book_questions_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`book_id` varchar(36) NOT NULL,
	`asker_id` varchar(36) NOT NULL,
	`seller_id` varchar(36) NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`is_answered` boolean NOT NULL DEFAULT false,
	`is_public` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `book_questions_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `books_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`category_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`caption` text,
	`description` text,
	`image` varchar(255),
	`file_url` varchar(255),
	`price` int NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`type` varchar(20) NOT NULL,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_items_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`cart_id` varchar(36) NOT NULL,
	`book_id` varchar(36) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carts_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carts_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`name` varchar(100) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_table_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`room_id` varchar(36) NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`receiver_id` varchar(36) NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`attachment_url` varchar(255),
	`attachment_type` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_rooms_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`book_id` varchar(36),
	`buyer_id` varchar(36) NOT NULL,
	`seller_id` varchar(36) NOT NULL,
	`last_message` text,
	`last_message_at` timestamp,
	`buyer_unread_count` int NOT NULL DEFAULT 0,
	`seller_unread_count` int NOT NULL DEFAULT 0,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_rooms_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discount_books_table` (
	`discount_id` varchar(36) NOT NULL,
	`book_id` varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discount_categories_table` (
	`discount_id` varchar(36) NOT NULL,
	`category_id` varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discounts_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`code` varchar(50) NOT NULL,
	`type` varchar(20) NOT NULL,
	`value` float NOT NULL,
	`min_purchase_amount` int,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 30 DAY),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discounts_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `discounts_table_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `notifications_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`link` varchar(255),
	`type` varchar(50) NOT NULL,
	`entity_id` varchar(36),
	`entity_type` varchar(50),
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`order_id` varchar(36) NOT NULL,
	`book_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	`type` varchar(20) NOT NULL,
	`download_url` varchar(255),
	`download_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`order_number` varchar(50) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`total_price` int NOT NULL,
	`shipping_address` text,
	`payment_method` varchar(50),
	`payment_status` varchar(20) DEFAULT 'unpaid',
	`tracking_number` varchar(100),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_table_order_number_unique` UNIQUE(`order_number`)
);
--> statement-breakpoint
CREATE TABLE `reviews_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`book_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`review` text NOT NULL,
	`rating` tinyint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`order_id` varchar(36) NOT NULL,
	`payment_id` varchar(100),
	`amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'IDR',
	`status` varchar(20) NOT NULL,
	`payment_method` varchar(50),
	`payment_details` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`avatar` varchar(255),
	`refresh_token` varchar(512),
	`role` varchar(20) NOT NULL DEFAULT 'user',
	`otp` varchar(255),
	`otp_expires_at` timestamp,
	`is_verified` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_table_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_table` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`user_id` varchar(36) NOT NULL,
	`book_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `book_questions_table` ADD CONSTRAINT `book_questions_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_questions_table` ADD CONSTRAINT `book_questions_table_asker_id_users_table_id_fk` FOREIGN KEY (`asker_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_questions_table` ADD CONSTRAINT `book_questions_table_seller_id_users_table_id_fk` FOREIGN KEY (`seller_id`) REFERENCES `users_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books_table` ADD CONSTRAINT `books_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books_table` ADD CONSTRAINT `books_table_category_id_categories_table_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items_table` ADD CONSTRAINT `cart_items_table_cart_id_carts_table_id_fk` FOREIGN KEY (`cart_id`) REFERENCES `carts_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cart_items_table` ADD CONSTRAINT `cart_items_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carts_table` ADD CONSTRAINT `carts_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages_table` ADD CONSTRAINT `chat_messages_table_room_id_chat_rooms_table_id_fk` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages_table` ADD CONSTRAINT `chat_messages_table_sender_id_users_table_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages_table` ADD CONSTRAINT `chat_messages_table_receiver_id_users_table_id_fk` FOREIGN KEY (`receiver_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_rooms_table` ADD CONSTRAINT `chat_rooms_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_rooms_table` ADD CONSTRAINT `chat_rooms_table_buyer_id_users_table_id_fk` FOREIGN KEY (`buyer_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_rooms_table` ADD CONSTRAINT `chat_rooms_table_seller_id_users_table_id_fk` FOREIGN KEY (`seller_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discount_books_table` ADD CONSTRAINT `discount_books_table_discount_id_discounts_table_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discount_books_table` ADD CONSTRAINT `discount_books_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discount_categories_table` ADD CONSTRAINT `discount_categories_table_discount_id_discounts_table_id_fk` FOREIGN KEY (`discount_id`) REFERENCES `discounts_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discount_categories_table` ADD CONSTRAINT `discount_categories_table_category_id_categories_table_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications_table` ADD CONSTRAINT `notifications_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items_table` ADD CONSTRAINT `order_items_table_order_id_orders_table_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items_table` ADD CONSTRAINT `order_items_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders_table` ADD CONSTRAINT `orders_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews_table` ADD CONSTRAINT `reviews_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews_table` ADD CONSTRAINT `reviews_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions_table` ADD CONSTRAINT `transactions_table_order_id_orders_table_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlist_table` ADD CONSTRAINT `wishlist_table_user_id_users_table_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlist_table` ADD CONSTRAINT `wishlist_table_book_id_books_table_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books_table`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `book_idx` ON `book_questions_table` (`book_id`);--> statement-breakpoint
CREATE INDEX `asker_idx` ON `book_questions_table` (`asker_id`);--> statement-breakpoint
CREATE INDEX `seller_idx` ON `book_questions_table` (`seller_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `books_table` (`title`);--> statement-breakpoint
CREATE INDEX `author_idx` ON `books_table` (`author`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `books_table` (`category_id`);--> statement-breakpoint
CREATE INDEX `cart_book_idx` ON `cart_items_table` (`cart_id`,`book_id`);--> statement-breakpoint
CREATE INDEX `room_idx` ON `chat_messages_table` (`room_id`);--> statement-breakpoint
CREATE INDEX `sender_idx` ON `chat_messages_table` (`sender_id`);--> statement-breakpoint
CREATE INDEX `receiver_idx` ON `chat_messages_table` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `chat_messages_table` (`created_at`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `chat_rooms_table` (`book_id`);--> statement-breakpoint
CREATE INDEX `buyer_idx` ON `chat_rooms_table` (`buyer_id`);--> statement-breakpoint
CREATE INDEX `seller_idx` ON `chat_rooms_table` (`seller_id`);--> statement-breakpoint
CREATE INDEX `last_message_idx` ON `chat_rooms_table` (`last_message_at`);--> statement-breakpoint
CREATE INDEX `discount_book_idx` ON `discount_books_table` (`discount_id`,`book_id`);--> statement-breakpoint
CREATE INDEX `discount_category_idx` ON `discount_categories_table` (`discount_id`,`category_id`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `discounts_table` (`code`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `discounts_table` (`is_active`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `entity_idx` ON `notifications_table` (`entity_id`,`entity_type`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `order_items_table` (`order_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `orders_table` (`user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `orders_table` (`status`);--> statement-breakpoint
CREATE INDEX `book_user_idx` ON `reviews_table` (`book_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `transactions_table` (`order_id`);--> statement-breakpoint
CREATE INDEX `user_book_idx` ON `wishlist_table` (`user_id`,`book_id`);