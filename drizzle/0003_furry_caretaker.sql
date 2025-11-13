CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('new_bid','price_change','auction_reminder','favorite_update','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`vehicleId` int,
	`read` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
