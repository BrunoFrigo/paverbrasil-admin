CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galleryWorks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryWorks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`color` enum('yellow','blue','green','pink','purple') NOT NULL DEFAULT 'yellow',
	`isPinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`category` enum('paver','bloco','guia','outro') NOT NULL,
	`unit` enum('m2','un','m_linear') NOT NULL,
	`description` text,
	`stock` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`description` text,
	`area` decimal(10,2),
	`totalValue` decimal(10,2) NOT NULL,
	`deliveryValue` decimal(10,2) NOT NULL DEFAULT 0,
	`status` enum('approved','pending','rejected','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quotations` ADD CONSTRAINT `quotations_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;