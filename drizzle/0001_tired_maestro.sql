CREATE TABLE `priceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`oldPrice` int NOT NULL,
	`newPrice` int NOT NULL,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `priceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteSettings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `siteStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`pageViews` int DEFAULT 0,
	`uniqueVisitors` int DEFAULT 0,
	`vehicleViews` int DEFAULT 0,
	`searchQueries` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `siteStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteStats_date_unique` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `syncLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`vehiclesAffected` int DEFAULT 0,
	`status` enum('success','error','warning') NOT NULL DEFAULT 'success',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `syncLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lotNumber` varchar(50) NOT NULL,
	`title` text NOT NULL,
	`brand` varchar(100),
	`model` varchar(100),
	`year` int,
	`currentBid` int NOT NULL,
	`location` varchar(200),
	`image` text,
	`description` text,
	`mileage` int,
	`fuel` varchar(50),
	`transmission` varchar(50),
	`color` varchar(50),
	`condition` varchar(100),
	`featured` int DEFAULT 0,
	`active` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_lotNumber_unique` UNIQUE(`lotNumber`)
);
